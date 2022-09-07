var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function markerSize(magnitude) {
    return magnitude * 5;
}

function markerColor(magnitude) {
    if (magnitude <= 1) {
        return "#daec92"
    } else if (magnitude <= 2) {
        return "#ecea92"
    } else if (magnitude <= 3) {
        return "#ecd592"
    } else if (magnitude <= 4) {
        return "#dfb778"
    } else if (magnitude <= 5) {
        return "#e5a05b"
    } else {
        return "#f58668"
    }
};
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>" + "Magnitude: " + (feature.properties.mag) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
            color: "#000",
            weight: 0.3,
            opacity: 0.5,
            fillOpacity: 1
        });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});


  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite": satellite,
    "Street Map": streetmap

  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [darkmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
      magnitudes = [0, 1, 2, 3, 4, 5];
      labels = [];
      legendInfo = "<strong>Magnitude</strong>";
      div.innerHTML = legendInfo;

      for (var i = 0; i < magnitudes.length; i++) {
          labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
               ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
      }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };

  legend.addTo(myMap);

};