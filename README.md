An AJV plugin for validating Objects whose attributes represent columns in
a table, a common practice for representing tabular data. 

This plugin adds a macro keyword "data-table" which is parameterized like
an object, and matches objects whose elements are arrays of a common length
with elements of the type described in the `properties` attribute of the
schema. 

### Usage:

```javascript
// Create an AJV instance
var Ajv = require("ajv");
var ajv = new Ajv();

// Load the `data-table` keyword onto the instance
require("ajv-data-table")(ajv)


// Create a data-table validator
valiate = ajv.compile({
    //https://github.com/epoberezkin/ajv/issues/297
    "$schema": "https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/json-schema-v5.json#",
    "data-table": {
        properties:{
            "foo":{type:'number'},
            "bar":{type:'string'},
            "bat":{type:'string',format:'email'},
        },
        required:[
            "foo",
            "bar",
        ],
        patternProperties:{
            "^@[a-z]+$":{
                type:"object",
                properties:{
                    name:{type:"string"},
                    time:{
                        type:"string",
                        format:"date",
                    }
                },
            }
        }
    }
})
```

#### Matching Examples


```javascript
// Object with arrays of a common length, and appropriate data types
{
    "foo":[1],
    "bar":["Hello"],
    "bat":["hello@world.com"],
}

{
    "foo":[1,2],
    "bar":["Hello","Foo"],
    "bat":["hello@world.com","foo@bar.com"],
}

// Empty arrays are ok
{
    "foo":[],
    "bar":[],
    "bat":[],
}

// optional properties (columns) are not required
{
    "foo":[],
    "bar":[],
}

// additional properties are handled according to `additionalProperties`
// and `patternProperties` from the schema
{
    "foo":[1],
    "bar":['hi'],
    "@foo":[{name:"foo",time:"2016-01-01"}],
}
```

#### Failing Examples

```javascript
// inconsistent array length
{
    "foo":[1,2],
    "bar":["Hello"],
    "bat":["Oscar@madison.com"],
}

{
    "foo":[1],
    "bar":[],
    "bat":[],
}

// invalid format string
{
    "foo":[1,2],
    "bar":["Hello","Oscar"],
    "bat":["world","madison"], // fails `format:'email'`
}

// missing required field "bar"
{
    "foo":[],
    "bat":[],
}

// fails the `patternProperties` from the schema
{
    "foo":[1],
    "bar":['hi'],
    "@foo":[{name:"foo",time:"yesterday afternoon"}],
}
```

