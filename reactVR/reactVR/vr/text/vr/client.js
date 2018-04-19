
import {VRInstance} from 'react-vr-web';
import {Module} from 'react-vr-web';
import * as THREE from 'three';

function init(bundle, parent, options) {
  const scene = new THREE.Scene();
  const cubeModule = new CubeModule();
  const vr = new VRInstance(bundle, 'CubeSample', parent, {
    cursorVisibility: 'visible',
    nativeModules: [ cubeModule ],
    scene: scene,
  });
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
  );
  cube.position.z = -4;
  scene.add(cube);
  cubeModule.init(cube);
  vr.render = function(timestamp) {
    const seconds = timestamp / 1000;
    cube.position.x = 0 + (1 * (Math.cos(seconds)));
    cube.position.y = 0.2 + (1 * Math.abs(Math.sin(seconds)));
  };
  vr.start();
  return vr;
}
export default class CubeModule extends Module {
  constructor() {
    super('CubeModule');
  }

  init(cube) {
    this.cube = cube;
  }
  changeCubeColor(color) {    
    this.cube.material.color = new THREE.Color(color);
  }
}
window.ReactVR = {init};
