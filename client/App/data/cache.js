define(function() {

	var Cache = function() {
		var self = this;

		self.createSet = function(name, setKey) {
			if (self[name])
				throw new Error("This set already exists on the cache");

			self[name] = [];
			self[name].find = function(key) {
				//We are replacing this method, so we use the Array protype version
				return Array.prototype.find.call(self[name], function(n) {
					return n[setKey] == key;
				});
			};
			self[name].remove = function(key) {
				var element = self[name].find(key);
				if (element)
					return false;
				Array.prototype.remove.call(self[name], element);
				return true;
			};
		};
	};

	return new Cache();
});