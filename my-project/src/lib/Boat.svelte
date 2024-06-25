<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let boat: THREE.Object3D;
    let container: HTMLDivElement;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(20, 20, 20);
        scene.add(light);

        const loader = new GLTFLoader();
        loader.load(
            './Boat.glb', // Path to your 3D model file
            (gltf: any) => {
                boat = gltf.scene;
                boat.scale.set(0.1,0.1,0.1); // Scale the model appropriately
                scene.add(boat);
                animate();
            }
        );
    }

    function animate() {
        requestAnimationFrame(animate);
        if (boat) {
            boat.rotation.y += 0.00;
        }
        renderer.render(scene, camera);
    }

    onMount(() => {
        init();
    });
</script>

<style>
    :global(body) {
        margin: 0;
        overflow: hidden;
    }
    div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Make the boat layer non-interactive */
    }
</style>

<div bind:this={container}></div>
