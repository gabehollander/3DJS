import React, {useEffect,useRef} from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import createPlatform from './components/platform';
import createPlayer from './components/player';
import { Figure } from './library/figure';
import { CONSTANTS } from './library/util'
import { createSpawner } from './components/spawner';


function App() {

  let rootRef = useRef(null);

  // list of figures to load initially
  const onLoad = [createPlatform,createPlayer];
  const figures = []

  useEffect(()=> {

        var world, camera, scene, renderer, controls;

        // initialize the physics 

        function initCannon() {
          world = new CANNON.World();
          world.gravity.set(0,-50, 0);
          world.broadphase = new CANNON.NaiveBroadphase();
        } 

        // initialize graphics rendering

        function initThree() {

          scene = new THREE.Scene();
          renderer = new THREE.WebGLRenderer();
          renderer.setSize( window.innerWidth, window.innerHeight );

          // ******* CAMERA INITIALIZATION CODE *******
          camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
          camera.position.set(1,25,25); // camera position to x , y , z
          camera.lookAt( new THREE.Vector3() )
          scene.add( camera );
          // orbital controls allow camera to pan around
          controls = new OrbitControls( camera, renderer.domElement );
          // disable the arrow keys for camera movement
          controls.enableKeys = false;
          controls.update()
          // *******************************************

          rootRef.appendChild( renderer.domElement );

        }

        initThree();
        initCannon();
        Figure.initFigures(scene,world,figures,onLoad);
        createSpawner(world,scene,figures);
        animate()

        function animate() {
          requestAnimationFrame( animate );
          controls.update();
          updatePhysics();
          render();
        }

        function syncFigures() {
          // Copy coordinates from Cannon.js to Three.js
          figures.forEach( fig => {
            fig.mesh.position.copy(fig.body.position);
            fig.mesh.quaternion.copy(fig.body.quaternion);
          })
        }

        function updatePhysics() {
          // Step the physics world
          world.step(CONSTANTS.TIMESTEP);
          syncFigures();
        }

        function render() {
          renderer.render( scene, camera );
        }
  });

  return (
    <div ref={ref => (rootRef = ref)}>
    </div>
  );
}

export default App;
