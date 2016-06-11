var helpers = {
	isCamelCase: function(str){
		return str.toLowerCase() === str;
	}
	,dasherize: dasherize
	,merge: merge
};

function dasherize(str){
	var match = /[A-Z]+/.test(str),
		arr = str.split(''),
		copy = [],
		res = null,
		isUpperCase = function(letter){
			return letter == letter.toUpperCase();
		};

	for(var i = 0,length = arr.length; i < length; i++){
		copy[i] = arr[i];
	}

	for(var i = 0,length = arr.length; i < length; i++){
		if(arr[i + 1] && isUpperCase(arr[i])){
			res = isUpperCase(arr[i + 1]);
			if(res && arr[i - 1] && !isUpperCase(arr[i - 1])){
				continue;
			}
			if(res || res === false && i === 0){
				copy[i] = arr[i].toLowerCase();
			}
		}else if(!arr[i + 1]){
			copy[i] = arr[i].toLowerCase();
		}
	}
	return copy.join('').
		toLowerCase();
}

function merge(){
	var obj = {},
		i = 0,
		il = arguments.length,
		key;
	for (; i < il; i++) {
		for (key in arguments[i]) {
			if (arguments[i].hasOwnProperty(key)) {
				obj[key] = arguments[i][key];
			}
		}
	}
	return obj;
}

module.exports = helpers;
