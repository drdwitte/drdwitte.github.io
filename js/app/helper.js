function addMarkersToMap(datapoints, map){

	for ( var i=0; i < datapoints.length; ++i )
	{

	   	L.marker( [datapoints[i].Lattitude, datapoints[i].Longitude] )
	      	.bindPopup(datapoints[i].Description)
	      	.addTo(map);
	}
}

function addMarkerToMap(lat, lon, desc, map){

	L.marker( [lat,lon])
	.bindPopup(desc)
	.addTo(map);
	
}


function addMarkerToGroup(lat, lon, desc, group){

	L.marker( [lat,lon])
	.bindPopup(desc)
	.addTo(group);
	
	//console.log(group);
}

function parseLatLon(strTuple){

	console.log(strTuple)
	var parts  = strTuple.substr(1,strTuple.length()-1).split(',');
	console.log(parts)
	var latlon = {
		'lat'	: parts[0],
		'lon'	: parts[1]
	}	
 
	return latlon;






}

function incMapValue(dict, key, val){
	dict[key] = (dict[key] || 0) + val;
	return;
}

var row = { width:1200, height: 300, margin:{top: 50, bottom: 50, left: 50, right: 50}};

function createCanvasRow(dom_path, nCol, max_nCol, row){

	var canvas_row = [];

	console.log(dom_path + " " + nCol + " " + max_nCol + " " + row);

	for (var i=0; i<nCol; i++){

		var w = row.width/max_nCol;
		var h = row.height;

		var svg_temp = d3.select(dom_path).append("svg")
			.attr("width", w)
			.attr("height", h)
			;
	
		canvas_row.push({svg:svg_temp, width:w, height:h, margin:row.margin});
	}	
	return canvas_row;
}

function visualize_linlin(dict, canvas, title){

	canvas.svg.append('text')
		.attr('x', canvas.margin.left)
		.attr('y', canvas.margin.top/2)
		.text(title)
		.style('fill','black')
		.style("font-family", "sans-serif")
		.style("font-size", "20x")
		;

	var keys_t = d3.keys(dict).map(function(d){ return +d;});
	var keys = d3.range(d3.min(keys_t),d3.max(keys_t)+1)
	
	var values = d3.values(dict);
	
	var xScale = d3.scale.ordinal()
				.domain(keys)
				.rangeRoundBands([canvas.margin.left,canvas.width-canvas.margin.right],0.1)
				;
	var yScale = d3.scale.linear()
				.domain([0, d3.max(values)])
				.range([canvas.height-canvas.margin.top,canvas.margin.bottom])
				;

	var bars = canvas.svg.selectAll('.bars').data(d3.entries(dict)).enter().append('g');

	var rects =  bars.append('rect')
			.attr('x',      function(d) { return xScale(d.key) - xScale.rangeBand()/2 })
			.attr('y',      function(d) { return yScale(d.value)  })
			.attr('width',  function(d) { return xScale.rangeBand()  })
			.attr('height', function(d) { return   yScale(0) - yScale(d.value)  })
			;


	bars.append('text')
		.attr('x', function(d) { return xScale(d.key)-xScale.rangeBand()/2.5 })
		.attr('y', function(d) { return canvas.height-canvas.margin.bottom/2  })
		.text(function(d){ return d.key.substring(0,8)})
		.style('fill','black')
		.style("font-family", "sans-serif")
		.style("font-size", "14px")
		;

	var textoffset = 15;
	bars.append('text')
		.attr('x', function(d) { return xScale(d.key) -xScale.rangeBand()/5; })
		.attr('y', function(d) { return yScale(d.value) + textoffset })
		.text(function(d){ return d.value})
		.style('fill','white')
		.style("font-family", "sans-serif")
		.style("font-size", "12px")
		;

		rects.on("mouseover", function(d){
				var currentBar = d3.select(this);
				currentBar.transition()
						.duration(100)
						.style('fill','red')

			});
		rects.on("mouseout", function(d){
				var currentBar = d3.select(this);
				currentBar.transition()
						.duration(500)
						.style('fill','black')
		

			});


}



function visualize_ordlin(dict, canvas, title){

	canvas.svg.append('text')
		.attr('x', canvas.margin.left)
		.attr('y', canvas.margin.top/2)
		.text(title)
		.style('fill','black')
		.style("font-family", "sans-serif")
		.style("font-size", "20x")
		;

	var keys = d3.keys(dict);
	var values = d3.values(dict);
	
	var xScale = d3.scale.ordinal()
				.domain(keys)
				.rangeRoundBands([canvas.margin.left,canvas.width-canvas.margin.right],0.1)
				;
	var yScale = d3.scale.linear()
				.domain([0, d3.max(values)])
				.range([canvas.height-canvas.margin.top,canvas.margin.bottom])
				;

	var bars = canvas.svg.selectAll('.bars').data(d3.entries(dict)).enter().append('g');

	var rects =  bars.append('rect')
			.attr('x',      function(d) { return xScale(d.key) - xScale.rangeBand()/2 })
			.attr('y',      function(d) { return yScale(d.value)  })
			.attr('width',  function(d) { return xScale.rangeBand()  })
			.attr('height', function(d) { return   yScale(0) - yScale(d.value)  })
			;


	bars.append('text')
		.attr('x', function(d) { return xScale(d.key)-xScale.rangeBand()/2.5 })
		.attr('y', function(d) { return canvas.height-canvas.margin.bottom/2  })
		.text(function(d){ return d.key.substring(0,9)})
		.style('fill','black')
		.style("font-family", "sans-serif")
		.style("font-size", "14px")
		;

	var textoffset = 12;
	bars.append('text')
		.attr('x', function(d) { return xScale(d.key) -xScale.rangeBand()/5; })
		.attr('y', function(d) { return yScale(d.value) + textoffset })
		.text(function(d){ return d.value})
		.style('fill','white')
		.style("font-family", "sans-serif")
		.style("font-size", "8px")
		;

		rects.on("mouseover", function(d){
				var currentBar = d3.select(this);
				currentBar.transition()
						.duration(100)
						.style('fill','red')

			});
		rects.on("mouseout", function(d){
				var currentBar = d3.select(this);
				currentBar.transition()
						.duration(500)
						.style('fill','black')
		

			});


}

function filterFreqTable(dict, minVal){

	new_dict = {}
	for (key in dict){
		if (dict[key] < minVal){

		} else {
			new_dict[key] = dict[key];
		}
	}

	return new_dict;

}

function renameKeys(dict, newKeys){
	new_dict = {}
	c = 0;
	for (key in dict){
		new_dict[newKeys[c++]] = dict[key]; 
	}
	return new_dict;


}

function createBaseLayer(){

	var attributionString = '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">';
	var subdomainsToQuery = ['otile1','otile2','otile3','otile4'];
	var s1 = 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png'; //map
	//var s2 = 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png'; //satellite
	var mapLayer = L.tileLayer( s1 , 
		{ 
			attribution: attributionString,
			subdomains: subdomainsToQuery
		});

	return mapLayer;


}

function createLayersForTags(tags){

	

	var layers = {};

	for (var i=0; i<tags.length; i++){

		

		layers[tags[i]] = L.featureGroup();

	}

	return layers;
		

	
}