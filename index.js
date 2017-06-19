module.exports = function(ajv){
	ajv.addKeyword('data-table', { 
		type: 'object', 
		macro: function (schema) {
			console.log("IN Schema:\n", JSON.stringify(schema,null,2) ,"\n");
			if(!schema.hasOwnProperty("properties"))
				throw new Error("schema is missing required property 'properties'")
			var props = [];
			for(var prop  in schema.properties){
				if(schema.properties.hasOwnProperty(prop)){
					props.push(prop)
				}
			}
			if(!props.length)
				throw new Error("schema.properties must have at least one property")
			var ref_prop = props[1];
			out = {
				type:"object",
				properties:{},
			}
			props.map(function(prop){
				out.properties[prop] = {
					"type":"array",
					"items":schema.properties[prop],
					"maxItems":{"$data":"1/"+ref_prop+"/length"},
					"minItems":{"$data":"1/"+ref_prop+"/length"}
				};
			})
			if(schema.patternProperties){
				out.patternProperties = {};
				for(prop in schema.patternProperties){
					if(!schema.patternProperties.hasOwnProperty(prop))
						continue;
					out.patternProperties[prop] = {
						"type":"array",
						"items":schema.patternProperties[prop],
						"maxItems":{"$data":"1/"+ref_prop+"/length"},
						"minItems":{"$data":"1/"+ref_prop+"/length"}
					};
				}
			}
			if(schema.required)
				out.required = schema.required
			if(schema.propertyNames)
				out.required = schema.propertyNames
			console.log("OUT Schema:\n", JSON.stringify(out,null,2) ,"\n");
			return out;
		}
	});
};

