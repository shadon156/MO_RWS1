<script>

    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';

    /**
     * @type {HTMLDivElement}
     */
    let mapContainer;

    onMount(() => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG9uMTU2IiwiYSI6ImNseDRnY3pxczBkdWQyanF0bm14ZHVvbGkifQ.SU1EtXJUTlEVINngdmWkfA';
        const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/shadon156/clx4mk5hp01td01pn5n8r2qba', // style URL
            center: [4.895168, 52.370216], // starting position [lng, lat]
            zoom: 18 // starting zoom)
        });
        map.on('load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.getStyle().layers;
            let labelLayerId;
            for (let i = 0; i < layers.length; i++) {
                // @ts-ignore
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addLayer(
                {
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
                },
                labelLayerId
            );
        });
    });
</script>

<div bind:this={mapContainer} style="width: 100%; height: 100vh;"></div>

<style>
    div {
        width: 100%;
        height: 100vh;
    }
</style>
