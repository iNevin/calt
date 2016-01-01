agency= new Meteor.Collection("agency");
stops= new Meteor.Collection("stops");
routes= new Meteor.Collection("routes");
trips= new Meteor.Collection("trips");
stop_times= new Meteor.Collection("stop_times");
calendar= new Meteor.Collection("calendar");
calendar_dates= new Meteor.Collection("calendar_dates");
fare_attributes= new Meteor.Collection("fare_attributes");
fare_rules= new Meteor.Collection("fare_rules");
shapes= new Meteor.Collection("shapes");
frequencies= new Meteor.Collection("frequencies");
if (Meteor.isClient) {
  // counter starts at 0
   

  Template.datab.helpers({
    'printdb':function(){
    var x= stops.find().fetch();
    console.log(x[0][0]);
    
    /*console.log(x[0][0]["agency_url"]);*/
    /*using this kind of return inroder to make sure data is available 
    and no error is thrown*/
    return x[0] && x[0][0];
  

  }
  });

  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var path = Npm.require('path');
  var base = path.resolve('.');
base = base.split('.meteor')[0];
    Npm.require("fs").readFile( base+"sample-feed.zip", Meteor.bindEnvironment( function (err, data) {
  if (err) throw err;
  var zip = new JSZip();
  zip.load(data);
  var files= file_list(zip.files);
  var i=0;
  for(i=0;i<files.length;i++){
  	
  	var json=CSV2JSON(zip.files[files[i]].asText());
  	var jsonobj = JSON.parse(json);
  	 var file_name=files[i].substring(0,(files[i].length-4));
  	 console.log("found "+files[i]);
  	 if(eval(file_name).find().count() === 0){
	    console.log("inserted "+files[i]);
	    eval(file_name).insert(jsonobj);
	 		}

  	//  switch(files[i]){
  	//  	case "agency.txt":
	  // 	 	if(agency.find().count() === 0){
	    
	  //   agency.insert(jsonobj);
	 	// 	}
	 	// 	break;
	 	// case "stops.txt":
	 	// if(stops.find().count() === 0){
	    
	  //   stops.insert(jsonobj);
	 	// 	}
	 	// 	break;


  	//  }
  }

 
 



if(agency.find().count() === 0){
    
    agency.insert(jsonobj);
 }
    /*for(ag in ags){
      console.log(ags[ah]);*/
    /*}*/
  
  /*}*/
  
},function () { console.log('Failed to bind environment');}));


  });
  
}

file_list = function(obj) {
    var size = 0, key;
    var files_array=[];
    for (key in obj) {
    	files_array.push(key);
    	
        if (obj.hasOwnProperty(key)) size++;
    }
    
    return files_array;
};
get_json = function(filename){
	  var json=CSV2JSON(zip.files[filename].asText());
var jsonobj = JSON.parse(json);
}

//ben nadal csv
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    arrData.pop();
    
    return (arrData);
}
//http://jsfiddle.net/sturtevant/AZFvQ/
function CSV2JSON(csv) {

    var array = CSVToArray(csv);

    var objArray = {};
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }
    
    var json = JSON.stringify(objArray);
// console.log(json);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  }
UI.registerHelper("arrayify", function(obj){
    result = [];
    for (var key in obj){
        result.push({name:key,value:obj[key]});
    }
    return result;
});
/*
  Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});*/
