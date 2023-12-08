//Store JSON
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating the map object
let myMap = L.map("map", {
    // Focus on US
    center: [37.0902, -95.7129],
    zoom: 4
  });

    // Adding the tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Add new layer
    let earthquakeGroup = new L.LayerGroup();

  // Get the data with d3.
  d3.json(baseURL).then(function(data) {
  
    //Color of the earthquake
    function getValue(x) {
      return x > 90 ? "red" :
            x > 70 ? "orangered" :
            x > 50 ? "orange" :
            x > 30 ? "yellow" :
            x > 10 ? "yellowgreen" :
            "lightgreen";
    }
   
    function style(feature) {
      return {
        "stroke": true,
            radius: feature.properties.mag * 3,
        fillColor: getValue(feature.geometry.coordinates[2]),
        color: "black",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      };
  }
  
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, style(feature));
      },
      
          // Binding a popup to each layer
          onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnitude: " +
              feature.properties.mag + "<br /><br />depth: " + feature.geometry.coordinates[2]);
          }
        }).addTo(earthquakeGroup);
  
        earthquakeGroup.addTo(myMap);
  
        //Add a legend
        let legend = L.control({ position: "bottomright" });
  
        legend.onAdd = function() {
  
            let div = L.DomUtil.create("div", "info legend");
            let grades = [-10, 10, 30, 50, 70, 90];
            let colors = ["lightgreen","yellowgreen","yellow","orange","orangered","red"];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '">&emsp;&emsp;</i> '
                + grades[i]
                + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
  
        return div;
        };
  
        legend.addTo(myMap);
  
  });
    