requirejs.config({

    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        "app": 		"../app",
	"jquery":	"//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min",
	"leaflet":	"../../external/leaflet/leaflet",
	"d3":		"d3.min",
	"jqueryUI":	"../../external/jquery-ui/jquery-ui.min",
	//"datatables":	"../../external/DataTables/datatables.min"
    }
});

// Start the main app logic.
requirejs(['jquery','leaflet','d3', "jqueryUI", /*'datatables' ,*/ 'app/helper'],
function ($, L, d3){
		

	var map;	
	var center = {lat:51.05, lng:4.20};
	var zoom = 9;
	
	function drawMap(){

		console.log('drawmap');
		
		mapcont = $('<div id="mapcontainer" style="width: 1400px; height: 500px"></div>');
		$('#map').append(mapcont)

			
		map = L.map('mapcontainer', {
	    	center: center,
	    	zoom: zoom,
	    
		});	

		
		//$('#map').empty();

		

		base = createBaseLayer();
		base.addTo(map);

		var ALL = "All";

		eva_tags = ["Eethuis", "EVA voordeel", "100% vegetarisch", "Snack", "Cateraar", "Approved by EVA", "Veganvriendelijk", 
		"100% plantaardig", "Gastronomisch", ALL];
		
		var eva_layers = createLayersForTags(eva_tags);

		for (t in eva_layers){
			eva_layers[t].addTo(map);
		}
	
		L.control.layers(eva_layers,[]).addTo(map);

	 	d3.json('data/restodata.json', function(data){
	 		console.log(data.length);

	 		//stats1 = {};
	 		//stats2 = {};
	 		//console.log(data[0].tags);

	 		var restonames = [];
	 		var streetnames = {};
	 		var citynames = {};


	 		for (var i=0; i<data.length; i++){
	 		
	 			var desc = "<p> " + data[i].name + "</p>"  + "<p> " + data[i].street + " " + data[i].zip + " " + data[i].city +   "</p>";
	 			var lat = data[i].lat;
	 			var lon = data[i].lon;


	 			var tags = data[i].tags;

	 			tags.forEach(function(el){
	 				addMarkerToGroup(lat,lon,desc,eva_layers[el]);
	 			});
	 			addMarkerToGroup(lat,lon,desc,eva_layers[ALL]);

	 			restonames.push(data[i].name);
	 			streetnames[data[i].street]=1;
	 			citynames[data[i].city]=1;

	 			/*prov = Math.floor(parseInt(data[i].zip)/1000);
	 			reg = Math.floor(parseInt(data[i].zip)/100);

	 			incMapValue(stats1,prov,1);
				incMapValue(stats2,reg,1);*/
	 		}

	 		/*console.log(stats1);
	 		console.log(stats2);


	 		row_bi1 = createCanvasRow("body div#bi1",1,2,row);
	 		row_bi2 = createCanvasRow("body div#bi2",1,1,row);

	 		stats1_f = filterFreqTable(stats1,5)
	 		stats1_ren = renameKeys(stats1_f, ['Brussel','Antwerpen','Limburg/Vlaams-Brabant','West-Vlaanderen','Oost-Vlaanderen'])
	 		stats2_f = filterFreqTable(stats2,2)

	 		visualize_ordlin(stats1_ren,  row_bi1[0], "Veggie locations per province");
	 		visualize_ordlin(stats2_f,  row_bi2[0], "Veggie locations per region");
			*/




			$('#restoname').autocomplete({
      			source: restonames
    		});

    		$('#street').autocomplete({
      			source: Object.keys(streetnames)
    		});

    		$('#city').autocomplete({
      			source: Object.keys(citynames)
    		});

			





 		});
	};

	drawMap();

	$('#draw_circle').on('click', function(){

		console.log(map.getCenter());
		var lat = map.getCenter().lat;
		var lon = map.getCenter().lng;

		lat_radius = 1000*parseFloat($('input#rad').val());
		//radius = lat_radius * 110.574;
		var circle = L.circle(map.getCenter(), lat_radius, {
					color: 'none',
					fillColor: 'green',
					fillOpacity: 0.5
		}).addTo(map);
	});

	$('#submit_searchaddress').on('click', function(){

		$("td#suggestion").text("")
		//map.setView(center, zoom);

		var street = $('input#street').val() || "";
		var zip = $('input#zip').val() || "";
		var city = $('input#city').val() || "";


		var address_concat = street + " " + zip + " " +  city;
		address_concat = address_concat.trim(); 
		console.log(address_concat);
		$.ajax({
			type: "GET",
			url: "http://loc.geopunt.be/v2/Suggestion",
			dataType: 'jsonp',
			accepts: {
        		text: "application/json"
    		},
    		data: {
    			q: address_concat,
    		}
		}).success(function(data) {
    		
    		var suggestions = data['SuggestionResult']
    		console.log(suggestions);
    		console.log(suggestions.length);

    		if (suggestions.length == 0){
    			$("td#suggestion").text("no suggestions")

    		} else {

    			if (suggestions.length > 3){
    				$("td#suggestion").text("ambiguous => >3 suggestions")
    			} else if (suggestions.length > 1){

    				var sugg = "Did you mean? ";

	    			for (var i=0; i<suggestions.length-1; i++){
	    				sugg+= "\"" + suggestions[i] + "\"" + " or "	
	    			}
	    			sugg+= "\"" + suggestions[suggestions.length-1] + "\"";
	    			$("td#suggestion").text(sugg);

    			}


    			$.ajax({
					type: "GET",
					url: "http://loc.geopunt.be/v2/Location",
					dataType: 'jsonp',
					accepts: {
		        		text: "application/json"
		    		},
		    		data: {
		    			q: suggestions[0],
		    		}
				}).success(function(latlonresponse) {


					var arr_result = latlonresponse['LocationResult'];
					//console.log(arr_result);
					if (arr_result.length> 0){

						var lat = parseFloat(arr_result[0]['Location']['Lat_WGS84']);
						var lon = parseFloat(arr_result[0]['Location']['Lon_WGS84']);

						console.log(lat);
						console.log(lon);
						

						var lalo = new L.LatLng(lat, lon);

						map.setView(lalo, 12);
						//map.panTo(lalo);
						//map.setZoom(12);


						




					} else {
						console.log("No location results")

					}

					



				});
			}

      		
  		});
		/*$.get( , { "q": "Klijtenstraat", "callback": true, 'Accept header':"'application/javascript" }, function(data){
			console.log(data);
		} );*/
		//http://loc.geopunt.be/v2/Location?
		//v2/Suggestion?q={q}
	});


	$

	$('#submit_searchname').on('click', function(){


		alert('You clicked "Find"');
	});

	$('#reset_map').on('click', function(){
		console.log('reset')
		$('#map').empty();			
		drawMap();
	});

});
	

 

