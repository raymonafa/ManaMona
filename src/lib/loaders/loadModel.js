import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function loadGLBModel(url) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      resolve(gltf.scene);
    }, undefined, reject);
  });
}
