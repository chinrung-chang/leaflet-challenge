// circle color by the depth
function getColor(d) {
    return d > 90  ? '#BD0026' :
           d > 70  ? '#E31A1C' :
           d > 50  ? '#FC4E2A' :
           d > 30   ? '#f0e720' :
           d > 10   ? '#99eb72' :
                      '#32cd32';
}

function createMap(earthquakeInfo) {

    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthquake layer.
    let overlayMaps = {
      "Earthquake location": earthquakeInfo
    };
  
    // Create the map object with options.
    let map = L.map("map", {
      center: [44.967243, -103.771556],
      zoom: 6,
      layers: [streetmap, earthquakeInfo]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);


    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our grade intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(map);

  }
  
  function createMarkers(response) {
  
    let quakesMarkers = [];
    for (let i = 0;i<response.features.length;i++)
    {
      let feature = response.features[i];
  
      // For each station, create a marker, and bind a popup with the earthquake's place name, mag and depth.
      let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],  {
        color: getColor(feature.geometry.coordinates[2]),
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: feature.properties.mag*10000})
        .bindPopup("<h3>" + feature.properties.place + "</h3><h3>Mag: " + feature.properties.mag + " ml</h3><h3>Depth: " + feature.geometry.coordinates[2] + " km</h3>");
    
      quakesMarkers.push(marker);
    }
    // Create a layer group that's made from the circle markers array, and pass it to the createMap function.
    createMap(L.layerGroup(quakesMarkers));
  }
  
  
  // Perform an API call to the past 7 days earthquake API to get the information. Call createMarkers when it completes.

  let apiUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  d3.json(apiUrl).then(createMarkers);
  