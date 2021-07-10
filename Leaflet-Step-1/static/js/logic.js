// Map Object
var myMap = L.map("map", {
    center: [39.8283, -98.5795], 
    zoom: 4
});

// Tile Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Earthquake data link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function sizeCircle(magnitude) {
    return magnitude * 3;
};

function colorCircle(depth, max) {
    if (depth >= 400) {
        color = "red";
    }
    else if (depth <= 400) {
        color = "orange";
    }
    else if (depth <= 300) {
        color = "yellow";
    }
    else if (depth <= 200) {
        color = "green";
    }
    else if (depth <= 100) {
        color = "blue";
    }
    else if (depth <= 0) {
        color = "grey";
    };

    return color;
};
// Access data from link
d3.json(url).then(data => {
    console.log(data);

    // Create a cluster group
    // var cluster_group = L.markerClusterGroup();
    var features = data.features;
    var depth_array = [];

    // Loop through data
    for (var i = 0; i < features.length; i++) {
        // Define variables from earthquake data
        var coordinates = features[i].geometry.coordinates;
        var latitude = coordinates[1];
        var longitude = coordinates[0];
        var depth = coordinates[2];

        depth_array.push(depth);

        var properties = features[i].properties;

        var place = properties.place;
        var magnitude = properties.mag;
        // Current time
        var time = moment(properties.time);

        // cluster_group.addLayer((L.marker([coordinates[1], coordinates[0]]))
        //     .bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}`));

        L.circleMarker([latitude, longitude], {
            color: "white",
            fillColor: colorCircle(depth, max),
            fillOpactiy: 0.6,
            radius: sizeCircle(magnitude)
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth}<br>Time: ${time}`).addTo(myMap);

        // console.log(coordinates);

    }

    console.log(Date(features[1000].properties.time));

    // Find min and max of depth
    var min = Math.min.apply(Math, depth_array);
    var max = Math.max.apply(Math, depth_array);
    var depth_range = max - min;



    // console.log(data.features);
    
    console.log(min);
    console.log(max);
    console.log(depth_range);


    // myMap.addLayer(cluster_group);

    // L.geoJson(data).addTo(myMap);
})

