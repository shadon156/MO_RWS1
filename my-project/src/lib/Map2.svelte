<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import geojson from './Path'; // Remove the .ts extension

    let mapContainer: HTMLDivElement | null = null;
    let getal1: number = 0; // Afvoer
    let getal2: number = 0; // Waterhoogte
    let getal3: number = 0; // Watertemperatuur
    let getal4: number = 0;
    let getal5: number = 0;
    let getal6: number = 0;



    //actueel
    const waterhoogteList = [
        4.454, 4.406, 4.394, 3.870, 3.790, 3.601, 3.436, 2.884, 2.724, 2.600,
        2.244, 2.120, 2.096, 1.429, 1.423, 1.408, 1.157, 1.149, 1.120, 1.109,
        0.809, 0.795, 0.785, 0.781, 0.511, 0.496, 0.490
    ];
    const afvoerList = [
        239.04, 132.54, 301.87, 314.99, 388.83,240.04, 186.54, 278.87, 313.99,
        233.04, 162.54, 378.87, 314.99, 334.83,240.04, 286.54, 275.87, 313.99
    ];
    const watertemperatuurList = [
        18.5, 18.5, 18.8, 18.6, 18.8, 18.7, 18.8, 18.6, 18.2, 18.6, 
        18.8, 18.7, 18.8, 18.6, 18.2
    ];



    // hoogwater
    const waterhoogteList2 = [
        8.72, 8.68, 8.71, 8.69, 8.70, 8.66, 8.64, 8.61, 8.60, 8.59,
        8.58, 8.57, 8.55, 8.54, 8.53, 8.52, 8.51, 8.50, 8.49, 8.48,
        8.47, 8.46, 8.45, 8.44, 8.43, 8.42, 8.41
    ];
    const afvoerList2 = [
        245.3, 250.1, 260.5, 255.8, 263.1, 268.7, 272.3, 275.9, 280.6, 285.2,
        243.3, 251.5, 245.5, 235.3, 263.1, 258.7, 242.3, 275.9, 267.6, 256.8
    ];
    const watertemperatuurList2 = [
        18.3, 18.5, 18.4, 18.6, 18.5, 18.7, 18.8, 18.6, 18.5, 18.7, 
        18.8, 18.7, 18.9, 18.8, 18.7
    ];




    let waterhoogteIndex = 0;
    let afvoerIndex = 0;
    let watertemperatuurIndex = 0;

    function updateNumbers() {
        if (waterhoogteIndex < waterhoogteList.length) {
            getal2 = waterhoogteList[waterhoogteIndex]; // Waterhoogte
            waterhoogteIndex++;
        }
        if (afvoerIndex < afvoerList.length) {
            getal1 = afvoerList[afvoerIndex]; // Afvoer
            afvoerIndex++;
        }
        if (watertemperatuurIndex < watertemperatuurList.length) {
            getal3 = watertemperatuurList[watertemperatuurIndex]; // Watertemperatuur
            watertemperatuurIndex++;
        }
    }

function updateNumbers2() {
        if (waterhoogteIndex < waterhoogteList2.length) {
            getal4 = waterhoogteList2[waterhoogteIndex]; // Waterhoogte
            waterhoogteIndex++;
        }
        if (afvoerIndex < afvoerList2.length) {
            getal5 = afvoerList2[afvoerIndex]; // Afvoer
            afvoerIndex++;
        }
        if (watertemperatuurIndex < watertemperatuurList2.length) {
            getal6 = watertemperatuurList2[watertemperatuurIndex]; // Watertemperatuur
            watertemperatuurIndex++;
        }
    }

    onMount(() => {
        mapboxgl.accessToken = 'YOUR_ACCESS_TOKEN_HERE';
        if (mapContainer) {
            const map = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/yourstyle', // style URL
                center: [5.684197812691798, 50.76291740322954], // starting position [lng, lat]
                zoom: 16.7, // starting zoom
                pitch: 60, // tilt the map
                bearing: -1.6 // rotate the map
            });

            map.on('load', () => {
                // Add the GeoJSON data to the map
                map.addSource('path', {
                    'type': 'geojson',
                    'data': geojson
                });

                map.addLayer({
                    'id': 'path',
                    'type': 'line',
                    'source': 'path',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '',
                        'line-width': 8
                    }
                });

                // Add 3D buildings
                map.addLayer({
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 1
                    }
                });

                // Create a marker
                const marker = new mapboxgl.Marker()
                    .setLngLat(geojson.features[0].geometry.coordinates[0])
                    .addTo(map);

                // Function to animate the marker along the path
                let step = 0;
                const coordinates = geojson.features[0].geometry.coordinates;
                const animationSpeed = 5000; // Increase the duration to slow down the animation

                function animateMarker() {
                    const start = coordinates[step];
                    const end = coordinates[step + 1];
                    if (!start || !end) return;

                    // Update the marker position
                    marker.setLngLat(end);
                    updateNumbers(); // Update the numbers when reaching a new point
                    updateNumbers2();

                    step += 1;
                    if (step < coordinates.length - 1) {
                        setTimeout(animateMarker, animationSpeed); // Add delay between steps
                    }
                }

                animateMarker();

                // Fit the map to the bounds of the GeoJSON
                const bounds = new mapboxgl.LngLatBounds();
                geojson.features.forEach(feature => {
                    feature.geometry.coordinates.forEach(coord => {
                        bounds.extend(coord);
                    });
                });
                map.fitBounds(bounds, {
                    padding: 20
                });

                // Optionally, animate the map to follow the path
                let mapStep = 0;

                function animateMap() {
                    const start = coordinates[mapStep >= coordinates.length ? mapStep - 1 : mapStep];
                    const end = coordinates[mapStep >= coordinates.length - 1 ? mapStep : mapStep + 1];
                    if (!start || !end) return;

                    // Update the camera position to be between start and end
                    map.easeTo({
                        center: end,
                        duration: animationSpeed,
                        easing: (t: number) => t
                    });

                    mapStep += 1;
                    if (mapStep < coordinates.length) {
                        setTimeout(animateMap, animationSpeed); // Add delay between steps
                    }
                }

                animateMap();
            });
        }
    });
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100vh;"></div>
<a class="absolute top-2 left-2 z-10 bg-accent px-8 py-3 font-bold rounded-xl" href="/KiesJeBoot">terug</a>
<div class="overlay period">
    <p>Hoogwater Periode: 13-07-2021 / 15-07-2021</p>
</div>
<div class="overlay left">
    <p>Afvoer: {getal5} m3/s</p>
    <p>Waterhoogte: {getal4} cm nap</p>
    <p>Watertemperatuur: {getal6} °C</p>
</div>
<div class="overlay actual">
    <p>Actuele Data: 22-06-2024</p>
</div>
<div class="overlay right">
    <p>Afvoer: {getal1} m3/s</p>
    <p>Waterhoogte: {getal2} cm nap</p>
    <p>Watertemperatuur: {getal3} °C</p>
</div>

<style>
    .overlay {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        font-size: 18px;
        width: 250px; /* Fixed width for the overlay box */
    }
    .overlay.right {
        bottom: 60px; /* Adjusted to make room for the actual data overlay */
        right: 20px;
    }
    .overlay.left {
        bottom: 60px; /* Adjusted to make room for the period overlay */
        left: 20px;
    }
    .overlay.period {
        bottom: 20px;
        left: 20px;
        width: auto; /* Auto width for period overlay */
        padding: 5px 10px; /* Smaller padding for period overlay */
        font-size: 16px; /* Smaller font size for period overlay */
    }
    .overlay.actual {
        bottom: 20px;
        right: 20px;
        width: auto; /* Auto width for actual data overlay */
        padding: 5px 10px; /* Smaller padding for actual data overlay */
        font-size: 16px; /* Smaller font size for actual data overlay */
    }
</style>