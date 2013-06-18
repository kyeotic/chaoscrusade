define(function() {

	var cache = {};

	cache.createSet = function(name, setKey) {
		if (cache[name])
			throw new Error("This set already exists in the cache");

		cache[name] = [];
		cache[name].find = function(key) {
			//We are replacing this method, so we use the Array protype version
			return Array.prototype.find.call(cache[name], function(n) {
				return n[setKey] == key;
			});
		};
		cache[name].remove = function(key) {
			var element = cache[name].find(key);
			if (element)
				return false;
			//We are replacing this method, so we use the Array protype version
			Array.prototype.remove.call(cache[name], element);
			return true;
		};
	};

	return cache;
});