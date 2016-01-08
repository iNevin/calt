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
temp=new Meteor.Collection("temp");
display=new Meteor.Collection("display");

var data;
var dir="0";//direction- use 1 for south bound, 0 for nb
if (Meteor.isClient) {
  // counter starts at 0
   

  Template.datab.helpers({
    'printdb':function(){
    	

    var x=stops.find().fetch();
    
    
    	console.log(stops.find().fetch().length);
    
    
    // for(var i=0;i<(get_json_size(x));i++) {
    // 	// if(get_stop_name(stop_times.find().fetch()[i].stop_id).stop_name){
    		
    // 	console.log(i+" "+"Stop id is : "+stop_times.find().fetch()[i].stop_id+ " Stop Name is "+get_stop_name(stop_times.find().fetch()[i].stop_id).stop_name);
    // // }
    	
    // 	// console.log(i);
    // }
    // console.log(get_stop_name("NANAA"));
    
    // console.log(sup());
    /*console.log(x[0][0]["agency_url"]);*/
    /*using this kind of return inroder to make sure data is available 
    and no error is thrown*/
    return x[0] ;
  

  },
  'print':function(){
  	return (stop_times.find().fetch().length);
  },
  'disp':function(){
  	return display.find().fetch();
  }
  });
  Template.datab.events({
  	
  	"submit .input-data":function(event){

  		event.preventDefault();
  		var stop_id= get_stop_id(event.target.input_place.value);
  		// stop_id++;
  		console.log(stop_id);
  		var date=event.target.input_date.value;
  		var service_id=get_service_id(date.toLowerCase());
  		
  		var trip_id=get_trip_id(service_id[0]);
  		
  		var result=[];
  		
  		for(var x in trip_id){
  			
  			data = get_stop_data(stop_id[dir].stop_id,trip_id[x]);
console.log(trip_id[x]);
if(data[0]){
  			result.push(data[0]);
  		}
  			
  		}

  		;
  		Meteor.call('clear_display');
  		// if((display.find().fetch().length)===0){
  		for(var i=0;i<result.length;i++){
  		display.insert(result[i]);
  	// }
  }
  		
  		event.target.input.value="";
  	}
  });
  Template.printer.helpers({
  	'printing':function(){
  	return display.find({}, {sort: {  arrival_time: 1 }}).fetch()
  }

  });

  
}
get_stop_name= function(stop_id){
	return stops.findOne(
{"stop_id":stop_id}
);
}
get_stop_id= function(stop_name){
	return stops.find(
{"stop_name":stop_name}
).fetch();
}
get_stop_data= function(stop_id,trip_id){
 return stop_times.find({ "$and": [
    {"stop_id":stop_id},
    { "trip_id":trip_id}
]}).fetch();
}
get_service_id= function(date){
	var key = date;
	var value = "1";
	var selector = {};
selector[key] = value;
	var matched_objs= calendar.find(selector).fetch();
	var result=[];
	for( var x in matched_objs){
		result.push(matched_objs[x].service_id);
	}
	return result;
}
get_trip_id=function(service_id){
	var matched_objs = trips.find({ "$and": [
{"service_id":service_id},
{"direction_id":dir}
]}
).fetch();
	var result=[];
	for( var x in matched_objs){
		result.push(matched_objs[x].trip_id);
	}

	return result;


}


get_json_size = function(obj) {
    var size = 0, key;
    
    for (key in obj) {
    	
        if (obj.hasOwnProperty(key)) size++;
    }
    
    return size;
};
if (Meteor.isServer) {
  Meteor.startup(function () {
    var path = Npm.require('path');
  var base = path.resolve('.');
base = base.split('.meteor')[0];
    Npm.require("fs").readFile( base+"caldata.zip", Meteor.bindEnvironment( function (err, data) {
  if (err) throw err;
  var zip = new JSZip();
  zip.load(data);
  var files= file_list(zip.files);
  var i=0;
  // display.remove({});
  for(i=0;i<files.length;i++){
  	
  	var json=CSV2JSON(zip.files[files[i]].asText());
// console.log(json);
  	var jsonobj = JSON.parse(json);
  	 var file_name=files[i].substring(0,(files[i].length-4));
  	 console.log("found "+files[i]);
  	 if(eval(file_name).find().count() === 0){

  	 	temp.insert(jsonobj);
	    console.log("inserted "+files[i]);
	    var x= temp.find().fetch();
	    for(var j=0;j<(get_json_size(x[0]))-1;j++) {
	    	
	    eval(file_name).insert(temp.find().fetch()[0][j]);
	}
	temp.remove({});


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

//Jos de Jong
function csv2array(data, delimeter) {
  // Retrieve the delimeter
  if (delimeter == undefined) 
    delimeter = ',';
  if (delimeter && delimeter.length > 1)
    delimeter = ',';

  // initialize variables
  var newline = '\n';
  var eof = '';
  var i = 0;
  var c = data.charAt(i);
  var row = 0;
  var col = 0;
  var array = new Array();

  while (c != eof) {
    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i); // read next char
    }
    
    // get value
    var value = "";
    if (c == '\"') {
      // value enclosed by double-quotes
      c = data.charAt(++i);
      
      do {
        if (c != '\"') {
          // read a regular character and go to the next character
          value += c;
          c = data.charAt(++i);
        }
        
        if (c == '\"') {
          // check for escaped double-quote
          var cnext = data.charAt(i+1);
          if (cnext == '\"') {
            // this is an escaped double-quote. 
            // Add a double-quote to the value, and move two characters ahead.
            value += '\"';
            i += 2;
            c = data.charAt(i);
          }
        }
      }
      while (c != eof && c != '\"');
      
      if (c == eof) {
        
      }

      c = data.charAt(++i);
    }
    else {
      // value without quotes
      while (c != eof && c != delimeter && c!= newline && c != ' ' && c != '\t' && c != '\r') {
        value += c;
        c = data.charAt(++i);
      }
    }

    // add the value to the array
    if (array.length <= row) 
      array.push(new Array());
    array[row].push(value);
    
    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i);
    }

    // go to the next row or column
    if (c == delimeter) {
      // to the next column
      col++;
    }
    else if (c == newline) {
      // to the next row
      col = 0;
      row++;
    }
    else if (c != eof) {
      // unexpected character
      
    }
    
    // go to the next character
    c = data.charAt(++i);
  }  
  
  return array;
}
//http://jsfiddle.net/sturtevant/AZFvQ/
function CSV2JSON(csv) {

    var array = csv2array(csv);
   
    var objArray = {};
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]

        }

    }
    
    var json = JSON.stringify(objArray);
 
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

Meteor.methods({
  clear_display: function () {
display.remove({});
  }
});
/*
  Handlebars.registerHelper('arrayify',function(obj){
    result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});*/
