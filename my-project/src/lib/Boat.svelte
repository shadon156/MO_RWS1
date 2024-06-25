<script lang="ts">
    // Importing necessary modules and components from Svelte and three.js
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

    // Declaring the main variables for the scene, camera, renderer, and the boat object
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let boat: THREE.Object3D;
    let container: HTMLDivElement;

    // Function to initialize the 3D scene
    function init() {
        // Creating a new 3D scene
        scene = new THREE.Scene();
        // Setting up the camera with perspective projection
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5; // Positioning the camera

        // Creating the WebGL renderer and setting its size
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement); // Appending the renderer to the container div

        // Adding a hemisphere light to the scene
        const light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(20, 20, 20);
        scene.add(light);

        // Loading the 3D boat model using GLTFLoader
        const loader = new GLTFLoader();
        loader.load(
            './Boat.glb', // Path to the 3D model file
            (gltf: any) => {
                boat = gltf.scene; // Assigning the loaded model to the boat variable
                boat.scale.set(0.1, 0.1, 0.1); // Scaling the boat model
                scene.add(boat); // Adding the boat to the scene
                animate(); // Starting the animation loop
            }
        );
    }

    // Function to handle the animation of the scene
    function animate() {
        requestAnimationFrame(animate); // Creating a loop to continually render the scene
        if (boat) {
            boat.rotation.y += 0.00; // Rotating the boat model (currently static, adjust for rotation)
        }
        renderer.render(scene, camera); // Rendering the scene with the camera
    }

    // Svelte lifecycle hook for after the component has been mounted to the DOM
    onMount(() => {
        init(); // Initialize the scene once the component mounts
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
        pointer-events: none;
    }
</style>


<div bind:this={container}></div>
