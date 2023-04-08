global.language='en';

// global.vi = {};
// global.en = {};

// var langLoader = require.context('./vi/', true, /\.js$/);
// langLoader.keys().forEach((key)=>{
// 	var lang =  langLoader(key)['langData'];
// 	vi = {...vi, ...lang};
// });

var langLoader = require.context('./en/', true, /\.js$/);
langLoader.keys().forEach((key)=>{
	var lang = langLoader(key)['langData']; 
	en = {...en, ...lang};
});

global.lang = function(string, variables=null){
	var translate = string;
	if(typeof(global[language][string]) != 'undefined'){
		translate = global[language][string]
	}

	if(typeof variables == 'string') variables = {data: variables};
	if(typeof variables == 'object'){
		for(let i in variables){
			translate = translate.replace(new RegExp('\{'+i+'\}','g'), lang(variables[i]))
		}
	}
	return translate;
}