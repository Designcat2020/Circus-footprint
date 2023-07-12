mapboxgl.accessToken = 'pk.eyJ1IjoieWFuc3VuMjAyMCIsImEiOiJjazg4dmFsbGcwMGcwM2xxc2Zla21zZG91In0.Kkqjs0MWxmSEeqe7yO-k5g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/yansun2020/cl7lwha92000a14la1i16jxwt',
  center: [108, 1.326],
  zoom: 2

});
map.scrollZoom.disable();

// //full-size display iframe context
// map.addControl(new mapboxgl.FullscreenControl());

map.on('load', function () {

  map.addSource('events', {
    'type': 'geojson',
    'data': 'data/Time.geojson',
});

  map.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: 'data/route.json' // replace this with the url of your own geojson
    },
    paint: {
      'line-color':'#ffc000',
      'line-width':1,
      'line-opacity': 1
    }
  });

  map.addLayer({
    id: 'city',
    type: 'symbol',
    source: 'events',
    layout: {
      'text-field': ['get', 'City'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': 12,                 
   },
  paint: {
      'text-color': '#ffffff',
   },
  filter: ['==', ['number', ['get', 'Scale']], 1]

  });

  map.addLayer({
    id: 'events',
    type: 'circle',
    source: 'events',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'Items']],
        4, 5,
        7, 10,
        20, 15,
        30, 20
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'Items']],
        1,
        '#ff3434',
        4,
        '#e67400',
        7,
        '#ffc61a',
        10,
        '#ffd91a',
        20,
        '#ffec1a',
        30,
        '#ffff1a'
      ],
      'circle-opacity': 0.8
    },
    'filter': ['==', ['number', ['get', 'Year']], 1876]
  });



  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false
  });



  // update hour filter when the slider is dragged
  document.getElementById('slider').addEventListener('input', (event) => {
    const year = parseInt(event.target.value);
    // update the map
    map.setFilter('events', ['==', ['number', ['get', 'Year']], year]);
    // update text in the UI
    document.getElementById('active-hour').innerText = year;
    // popup setup

    map.on('mousemove', 'events', (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('click', 'events', (e) => {
      // Use the first found feature.
      const circus = e.features[0].properties.Circus;
      const cityName = e.features[0].properties.City;
      const days = e.features[0].properties.Items;

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          '<strong>' + ' Events in ' + year + ' '+ cityName +': </strong>'
          + '<br>' + circus + '<br>' 
          + 'for <strong>' + days + '</strong> times.'
            )
        .addTo(map);

    });

    map.on('mouseleave', 'events', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  });
map.addControl(new mapboxgl.FullscreenControl());

});
