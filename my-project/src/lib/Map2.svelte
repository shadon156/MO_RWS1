<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl'; // Import Mapbox GL JS
    import geojson from '$lib/Path.ts'; // Ensure this is the correct path to your GeoJSON file
    import { writable } from 'svelte/store';

    let mapContainer: HTMLDivElement | null = null;
    let map: any; // Use 'any' type to bypass type checking issues
    let animationFrameId: number | null = null;
    const isAnimating = writable(false);

    // Your custom marker image
    const markerImage = 'src/static/boat.png'; // Update this with the path to your marker image

    onMount(() => {
        (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2hhZG9uMTU2IiwiYSI6ImNseDRnY3pxczBkdWQyanF0bm14ZHVvbGkifQ.SU1EtXJUTlEVINngdmWkfA';
        if (mapContainer) {
            map = new (mapboxgl as any).Map({
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

                // Load the custom marker image
                map.loadImage(markerImage, (error: any, image: any) => {
                    if (error) throw error;
                    if (!map.hasImage('marker-icon')) {
                        map.addImage('marker-icon', image);
                    }

                    // Add a symbol layer for the moving marker
                    map.addLayer({
                        'id': 'marker-layer',
                        'type': 'symbol',
                        'source': 'path',
                        'layout': {
                            'icon-image': 'marker-icon',
                            'icon-size': 0.1,
                            'icon-allow-overlap': true
                        }
                    });

                    // Fit the map to the bounds of the GeoJSON
                    const bounds = new (mapboxgl as any).LngLatBounds();
                    geojson.features.forEach((feature: any) => {
                        feature.geometry.coordinates.forEach((coord: any) => {
                            bounds.extend(coord);
                        });
                    });
                    map.fitBounds(bounds, {
                        padding: 20
                    });

                    // Start animation
                    startAnimation();
                });
            });
        }
    });

    function startAnimation() {
        if (!animationFrameId) {
            isAnimating.set(true);
            animate();
        }
    }

    function stopAnimation() {
        if (animationFrameId) {
            isAnimating.set(false);
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    let step = 0;
    const coordinates = geojson.features[0].geometry.coordinates;
    const animationSpeed = 5000; // Increase the duration to slow down the animation

    function animate() {
        isAnimating.subscribe(animating => {
            if (animating) {
                const start = coordinates[step >= coordinates.length ? step - 1 : step];
                const end = coordinates[step >= coordinates.length - 1 ? step : step + 1];
                if (!start || !end) return;

                // Update the marker position to be between start and end
                map.getSource('path').setData({
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': end
                        }
                    }]
                });

                step += 1;
                if (step < coordinates.length) {
                    animationFrameId = requestAnimationFrame(() => setTimeout(animate, animationSpeed));
                } else {
                    step = 0; // Reset step to loop the animation
                }
            }
        });
    }
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100vh;"></div>
<div style="position: absolute; top: 10px; left: 10px; z-index: 1;">
    <button on:click={startAnimation}>Start</button>
    <button on:click={stopAnimation}>Stop</button>
</div>

<style>
    div {
        width: 100%;
        height: 100vh;
    }

    button {
        margin: 5px;
        padding: 10px 20px;
        font-size: 16px;
    }
</style>
