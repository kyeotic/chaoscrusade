ko.observableArray.fn.map = function(data, constructor, options) {
    if (options.purge)
        this.removeAll();
    this(ko.utils.arrayMap(data, function(i) {
        return new constructor(i);
    }));
};

ko.observableArray.fn.pushAll = function(items){
    if(!(items instanceof Array)) return this.peek().length;
    this.valueWillMutate();
    ko.utils.arrayPushAll(this.peek(), items);
    this.valueHasMutated();
    return this.peek().length;
};

ko.extenders.numeric = function(target, options) {
    //create a writeable computed observable to intercept writes to our observable
    var result = ko.computed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, options.precision || 0),
                newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue),
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
            if (options.positive){
                valueToWrite = Math.abs(valueToWrite);
            }
            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    });
 
    //initialize with current value to make sure it is rounded appropriately
    result(target());
 
    //return the new computed observable
    return result;
};
