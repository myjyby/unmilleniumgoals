function unique(value, index, self){ 
    return self.indexOf(value) === index;
}

function uniqueinobj(arr){
	var newarr = [];
	var unique = {};

	arr.forEach(function(item) {
		if (!unique[item.age]) {
			newarr.push(item);
			unique[item.age] = item;
		}
	});

	return newarr;
}

function rmna(arr){
	return arr.filter(function(n){ return n != undefined });
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function(val, all) {
    var i, removedItems = [];
    if (all) {
      for(i = this.length; i--;){
        if (this[i] === val) removedItems.push(this.splice(i, 1));
      }
    }
    else {  //same as before...
      i = this.indexOf(val);
      if(i>-1) removedItems = this.splice(i, 1);
    }
    return removedItems;
  };
}