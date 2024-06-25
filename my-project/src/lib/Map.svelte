<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
    import geojson from './Path'; // Remove the .ts extension
    import * as THREE from 'three';

    let mapContainer: HTMLDivElement | null = null;

    onMount(() => {
        mapboxgl.accessToken = 'YOUR_ACCESS_TOKEN_HERE';
        if (mapContainer) {
            const map = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/yourstyle', // style URL
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
                        'fill-extrusion-opacity': 1
                    }
                });

                // Set up three.js
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(map.getCanvas().width, map.getCanvas().height);
                map.getCanvas().parentNode.appendChild(renderer.domElement);

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, map.getCanvas().width / map.getCanvas().height, 0.1, 1000);

                // Create a cube as a 3D marker
                const geometry = new THREE.BoxGeometry(100, 100, 100); // Increase the size of the cube for visibility
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);

                const animate = () => {
                    requestAnimationFrame(animate);
                    renderer.render(scene, camera);
                };
                animate();

                // Function to animate the 3D marker along the path
                let step = 0;
                const coordinates = geojson.features[0].geometry.coordinates;
                const animationSpeed = 5000; // Increase the duration to slow down the animation

                function animateMarker() {
                    const start = coordinates[step];
                    const end = coordinates[step + 1];
                    if (!start || !end) return;

                    // Update the marker position
                    const lngLat = new mapboxgl.LngLat(end[0], end[1]);
                    const point = map.project(lngLat);
                    cube.position.set(point.x, -point.y, 0); // Negate y to match WebGL coordinate system

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

                // Adjust camera and renderer upon map render and resize events

                map.on('render', () => {
                    const rotation = map.getBearing() * Math.PI / 180;
                    const pitch = map.getPitch() * Math.PI / 180;

                    camera.projectionMatrix.makePerspective(
                        -camera.aspect * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.near,
                        camera.aspect * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.near,
                        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.near,
                        -Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.near,
                        camera.near,
                        camera.far
                    );

                    camera.matrixWorld.makeRotationFromEuler(new THREE.Euler(pitch, rotation, 0, 'YXZ'));
                    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
                });

                map.on('resize', () => {
                    renderer.setSize(map.getCanvas().width, map.getCanvas().height);
                    camera.aspect = map.getCanvas().width / map.getCanvas().height;
                    camera.updateProjectionMatrix();
                });
            });
        }
    });
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100vh;"></div>
<a class="absolute top-2 left-2 z-10 bg-accent px-8 py-3 font-bold rounded-xl" href="/KiesJeBoot">terug</a>

<style>
    div {
        width: 100%;
        height: 100vh;
    }
</style>
