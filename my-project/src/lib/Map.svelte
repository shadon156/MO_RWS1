<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import geojson from './Path'; // Remove the .ts extension

    let mapContainer: HTMLDivElement | null = null;

    onMount(() => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG9uMTU2IiwiYSI6ImNseDRnY3pxczBkdWQyanF0bm14ZHVvbGkifQ.SU1EtXJUTlEVINngdmWkfA';
        if (mapContainer) {
            const map = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/shadon156/clx4mk5hp01td01pn5n8r2qba', // style URL
                center: [5.684197812691798, 50.76291740322954], // starting position [lng, lat]
                zoom: 18, // starting zoom
                pitch: 60, // tilt the map
                bearing: -17.6 // rotate the map
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
                        'line-color': '#888',
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
                        'fill-extrusion-opacity': 0.6
                    }
                });

                // Create a marker
                const marker = new mapboxgl.Marker()
                    .setLngLat(geojson.features[0].geometry.coordinates[0])
                    .addTo(map);

                // Function to animate the marker along the path
                let step = 0;
                const coordinates = geojson.features[0].geometry.coordinates;
                const animationSpeed = 1000; // Increase the duration to slow down the animation

                function animateMarker() {
                    const start = coordinates[step];
                    const end = coordinates[step + 1];
                    if (!start || !end) return;

                    // Update the marker position
                    marker.setLngLat(end);

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

<style>
    div {
        width: 100%;
        height: 100vh;
    }
</style>
