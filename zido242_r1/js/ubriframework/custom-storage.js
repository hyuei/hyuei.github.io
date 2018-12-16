CustomStorage = {
  ID: "Zido-Forest Run",
}

CustomStorage.proxy = {
  // dummy data for fallback
};

CustomStorage.data = {
	videoWatched : false,
  highScore : 0,
}

function isLocalStorageNameSupported() {
  var testKey = "test";
  var storage = window.localStorage;
  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}


CustomStorage.init = function() {
}

CustomStorage.set = function(name, value) {
  name = CustomStorage.ID+btoa(name);
  value = btoa(JSON.stringify(value));
  value = LZString.compressToUTF16(value);

  if( !isLocalStorageNameSupported() ){
    CustomStorage.proxy[name] = value;
  }
  else {
    localStorage.setItem(name, value);
  }
  
}

CustomStorage.get = function(name) {
  name = CustomStorage.ID+btoa(name);
  var value;

  if( !isLocalStorageNameSupported() ){
    value = CustomStorage.proxy[name];
  }
  else {
     value = localStorage.getItem(name);
  }


  value = LZString.decompressFromUTF16(value);
  if (value)
    return JSON.parse(atob(value));
  else 
    return null;
}

CustomStorage.remove = function(name) {
  name = CustomStorage.ID+btoa(name);
  if( !isLocalStorageNameSupported() ){
    CustomStorage.proxy[name] = null;
  }
  else {
    localStorage.removeItem(name);    
  }
}


CustomStorage.checkSpace = function() {
  var totalSpace = 0;
  for(var x in localStorage) {
    totalSpace += localStorage[x].length * 2;
    console.log(x+"="+((localStorage[x].length * 2)/1024).toFixed(2)+" KB");
  }
  console.log("Total Space ="+(totalSpace/1024).toFixed(2)+" KB");
  return totalSpace;

}

CustomStorage.saveAll = function(){
	var data = CustomStorage.data;
	CustomStorage.set('', data)
}

CustomStorage.save = function(key, value){
	var data = CustomStorage.get('');
	if(!data){
		CustomStorage.saveAll()
	}

	CustomStorage.data[key] = value;
	CustomStorage.saveAll();
}

CustomStorage.loadAll = function(){	
	var test = CustomStorage.get('');
	if(test == null){
		CustomStorage.saveAll();
		return;
	}
	
	CustomStorage.data = test;
}

CustomStorage.load = function(key){
	var test = CustomStorage.get('');
	if(!test.hasOwnProperty('key')){
		throw("Can't load data")
		return;
	} else {
		CustomStorage.data[key] = test[key];
	}
}