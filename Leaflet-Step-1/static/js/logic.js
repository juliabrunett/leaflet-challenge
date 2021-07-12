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
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Earthquake data link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to size the circle by magnitude
function sizeCircle(magnitude) {
    return magnitude * 3;
};

// Function to color the circle by depth
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#ffffb2";
    }
    else if (depth < 90 && depth >= 70) {
        color = "#fed976";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#feb24c";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#fd8d3c";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#f03b20";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#bd0026";
    };

    // ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']

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

        // Define depth & push to an array
        var depth = coordinates[2];
        depth_array.push(depth);

        var properties = features[i].properties;

        // Define place & magnitude
        var place = properties.place;
        var magnitude = properties.mag;

        // Current time
        var time = moment(properties.time);

        // Cluster Group Version
        // cluster_group.addLayer((L.marker([coordinates[1], coordinates[0]]))
        //     .bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}`));

        // Create markers
        L.circleMarker([latitude, longitude], {
            color: "white",
            fillColor: colorCircle(depth),
            opactiy: 1,
            fillOpacity: 1,
            radius: sizeCircle(magnitude)
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth}<br>Time: ${time}`).addTo(myMap);

        // console.log(coordinates);

    }

    // Find min and max of depth
    // var min = Math.min.apply(Math, depth_array);
    // var max = Math.max.apply(Math, depth_array);
    // console.log(min);
    // console.log(max);

    // Cluster Group Version
    // myMap.addLayer(cluster_group);

    // Add all to map
    // L.geoJson(data).addTo(myMap);
})

