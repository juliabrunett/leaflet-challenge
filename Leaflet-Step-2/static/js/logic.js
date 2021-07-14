// LINKS TO DATA:
// Earthquake data link
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Tectonic Plates Link: https://github.com/fraxen/tectonicplates 
var tectonic_plates_link = "./static/data/GeoJSON_tectonic/PB2002_plates.json"

// Function to size the circle by magnitude
function sizeCircle(magnitude) {
    return magnitude * 4;
};

// Function to color the circle by depth
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#bd0026";
    }
    else if (depth < 90 && depth >= 70) {
        color = "#f03b20";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#fd8d3c";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#feb24c";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#fed976";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#ffffb2";
    };

    return color;
};

// Pull in tectonic plates data
d3.json(tectonic_plates_link).then(function(plates_data) {
    console.log("Plates Data", plates_data);

    // For each feature in plates data, create a pop up
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3> ${feature.properties.PlateName} Plate</h3>`);
    }

    // Define map style for tectonic plates layer
    var mapStyle = {
        color: "#FF934F",
        fillColor: "white",
        fillOpacity: 0.1,
        weight: 2.5
    };

    // Define variable for plates location
    var plates = L.geoJson(plates_data, {
        style: mapStyle,
        onEachFeature: onEachFeature
    });

    // Access earthquake data from link
    d3.json(earthquake_url).then(function(earthquake_data) {
        console.log("Earthquake Data", earthquake_data);

        // Create a cluster group (Cluster Group Version)
        // var cluster_group = L.markerClusterGroup();

        // Define features
        var features = earthquake_data.features;
        // Create depth array for holding depth values
        var depth_array = [];

        // Define earthquake markers array
        earthquake_markers = [];

        // Loop through data
        for (var i = 0; i < features.length; i++) {
            // Define variables from earthquake data
            var coordinates = features[i].geometry.coordinates;
            var latitude = coordinates[1];
            var longitude = coordinates[0];

            // Define depth & push to an array
            var depth = coordinates[2];
            depth_array.push(depth);

            // Define properties
            var properties = features[i].properties;

            // Define place & magnitude
            var place = properties.place;
            var magnitude = properties.mag;

            // Current time
            var time = moment(properties.time);

            // Cluster Group Version
            // cluster_group.addLayer((L.marker([coordinates[1], coordinates[0]]))
            //     .bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}`));

            // Create earthquake markers & push to array
            earthquake_markers.push( 
                L.circleMarker([latitude, longitude], {
                color: "black",
                weight: 1,
                fillColor: colorCircle(depth),
                opactiy: 1,
                fillOpacity: 1,
                radius: sizeCircle(magnitude)
            }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth} km<br>Time: ${time}`)
            );
            // console.log(coordinates);

        };

    // BASE LAYERS
    // Tile Layer (Light)
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    
    // Tile Layer (Satellite)
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    
    // Tile Layer (Outdoors)
    var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Define base maps object
    var baseMaps = {
        "Light Map": lightMap,
        "Satellite Map": satelliteMap,
        "Outdoors Map": outdoorsMap
    
    };

    // Define earthquake layer (with markers)
    var earthquake_layer = L.layerGroup(earthquake_markers);

    // Define overlay maps object
    var overlayMaps = {
        "Tectonic Plates": plates,
        "Earthquakes": earthquake_layer
    };
    
    // Define Map Object
    var myMap = L.map("map", {
        center: [39.8283, -98.5795], 
        zoom: 4,
        layers: [lightMap, plates, earthquake_layer],
    });
    
    // TITLE
    // Create info title
    var info = L.control({position: "topright"});

    // Define function when info is added
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "info");
        var title = "<h1>Earthquakes in the Last 7 Days</h1>"
        div.innerHTML = title;

        return div
    }

    // LEGEND
    // Create Legend
    var legend = L.control({ position: "bottomright" });

    // Define function when legend is added
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var limits = [-10, 10, 30, 50, 70, 90];
        var title = "<h2>Depth in km</h2>"

        // Add title to div
        div.innerHTML = title;

        // Loop through limits, and create a new legend line
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorCircle(limits[i] + 1) + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add the legend & the info title to the map
    legend.addTo(myMap);
    info.addTo(myMap);

    // Add control to map (to choose layers)
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

// Cluster Group Version
// myMap.addLayer(cluster_group);

// Beginning Version: Add all to map
// L.geoJson(data).addTo(myMap);
});
});