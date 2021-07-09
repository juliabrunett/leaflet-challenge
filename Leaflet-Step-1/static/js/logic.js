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

// Loop through data from link
d3.json(url).then(data => {
    console.log(data);

    // Create a cluster group
    var cluster_group = L.markerClusterGroup();
    var features = data.features;

    for (var i = 0; i < features.length; i++) {
        var coordinates = features[i].geometry.coordinates;
        var properties = features[i].properties;
        var place = properties.place;
        var magnitude = properties.mag;
        var time = Date(properties.time);
        var updated_time = Date(properties.updated);

        cluster_group.addLayer((L.marker([coordinates[1], coordinates[0]]))
            .bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}`));

        // console.log(coordinates);

    }
    
    console.log(updated_time);
    console.log(data.features);

    myMap.addLayer(cluster_group);

    // L.geoJson(data).addTo(myMap);
})

