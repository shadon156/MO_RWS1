declare module 'threebox' {
    import { Scene, Object3D, WebGLRenderer, PerspectiveCamera } from 'three';
    import { Map } from 'mapbox-gl';

    export default class Threebox {
        constructor(map: Map, glContext: WebGLRenderingContext, options: { defaultLights: boolean });
        scene: Scene;
        renderer: WebGLRenderer;
        camera: PerspectiveCamera;
        loadObj: (options: { obj: string; mtl: string; scale: number; type: string; rotation: { x: number; y: number; z: number } }) => Promise<Object3D>;
    }
}
