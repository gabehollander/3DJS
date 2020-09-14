import React, {useEffect,useState, useRef} from 'react';
import './App.css';
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import createPlatform from './components/platform';
import createPlayer from './components/player';
import { Figure } from './library/figure';
import { CONSTANTS } from './library/util'
import { createSpawner } from './components/spawner';
import createWater from './components/water';
import createSky from './components/sky';
import createCollisionPlane from './components/collision-plane';
import createBoxCollisionPlane from './components/box-collision-plane';
import GameOverMenu from './components/game-over-menu';

function App() {

  let rootRef = useRef();

  const [bodiesToRemove, setBodiesToRemove] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [shouldRestart, setShouldRestart] = useState(false);
  const [figures, setFigures] = useState([])
  const [animationStarted, setAnimationStarted] = useState(false);
  const [renderer, setRenderer] = useState(null);
  const [world, setWorld] = useState(null);
  const [camera, setCamera] = useState(null);
  const [PMREMGenerator, setPMREMGenerator] = useState(null);
  const [scene, setScene] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(null);

  // const addFigure = (fig) => {
  //   let temp = [...figures]
  //   temp = temp.concat(fig);
  //   setFigures(temp);
  // }

  useEffect(()=> {
    const s = new THREE.Scene();
    setScene(s);

    const r = new THREE.WebGLRenderer();
    r.setSize( window.innerWidth, window.innerHeight );
    setRenderer(r);
  
    const w = new CANNON.World();
    w.gravity.set(0,-50, 0);
    w.broadphase = new CANNON.NaiveBroadphase();
    setWorld(w);
  
  },[])

  useEffect(()=> {
    if(renderer) {
      setPMREMGenerator(new THREE.PMREMGenerator( renderer ));
      rootRef.appendChild( renderer.domElement );
    }
  },[renderer]);

  useEffect(() => {
    if (scene) {
      const c = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
      c.position.set(-75,40,100); // camera position to x , y , z
      c.lookAt( new THREE.Vector3() )
      setCamera(c);
      scene.add( c );
    }
  },[scene]);

  useEffect(() => {
    if (camera && renderer) {
      // orbital controls allow camera to pan around
      const cont = new OrbitControls( camera, renderer.domElement );
      // disable the arrow keys for camera movement
      cont.enableKeys = false;
      cont.update()
    }
  },[renderer,camera])

  useEffect(() => {
    if (scene && world && camera) {
      const addBodyToRemove = (body) => {
        setBodiesToRemove(bodiesToRemove.push(body));
      }
      const addFigure = (fig) => {
        figures.push(fig)
        setFigures(figures);
      }
      const onLoad = [
        createPlatform,
        createPlayer.bind(this,camera),
        createWater,
        createSky,
        createCollisionPlane.bind(this,addBodyToRemove,endGame),
        createBoxCollisionPlane.bind(this,addBodyToRemove)
      ];
      Figure.initFigures(scene,world,onLoad,addFigure);
    }
  },[scene,world,camera])

  useEffect(() => {
    if (world && renderer && camera) {
      console.log(figures);
      // if (animationFrame) {
      //   window.cancelAnimationFrame(animationFrame);
      //   setAnimationFrame(null);
      // }
      const player = figures.find(x=> x.name === 'player');
      const water = figures.find(x=> x.name === 'water');
      function animate() {
        if (!animationFrame) {
          setAnimationFrame(requestAnimationFrame( animate ));
        }
        // requestAnimationFrame( animate )
        if (water) {
          water.mesh.material.uniforms[ 'time' ].value += 1.0 / 60.0;
        }
        updatePhysics();
        if (player) {
          player.fns.handlePlayerMovement();
        }
        render();
      }
      animate()
    }
    function updatePhysics() {
      function syncFigures() {
        // Copy coordinates from Cannon.js to Three.js
        figures.forEach( fig => {
          if(fig.mesh && fig.body) {
            fig.mesh.position.copy(fig.body.position);
            fig.mesh.quaternion.copy(fig.body.quaternion);
          }  
        });
      }
      // Step the physics world
      world.step(CONSTANTS.TIMESTEP);
      syncFigures();
    }

    function render() {
      // const removeBodies = () => {
      //   bodiesToRemove.forEach(body => {
      //     world.remove(body);
      //     body.meshRef.geometry.dispose()
      //     body.meshRef.material.dispose()
      //     scene.remove(body.meshRef);
      //   })
      //   setBodiesToRemove([]);
      // }
      // removeBodies();
      renderer.render( scene, camera );
    }

  },[renderer,world,camera,figures,animationFrame])

   useEffect(()=> {
     if (!animationStarted) {

      const player = figures.find(x=> x.name === 'player');
      const water = figures.find(x=> x.name === 'water');
      const sky = figures.find(x=> x.name === 'sky');

      if (player && water && sky && world && scene && PMREMGenerator && camera) {
        const addFigure = (fig) => {
          figures.push(fig)
          setFigures(figures);
        }
        setAnimationStarted(true);
        updateSun(sky,scene);
        createSpawner(world,scene,addFigure);
        function updateSun(sky,scene) {
    
          const sun = new THREE.Vector3();
    
          var parameters = {
            inclination: 0.49,
            azimuth: 0.205
          };

          var theta = Math.PI * ( parameters.inclination - 0.5 );
          var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
    
          sun.x = Math.cos( phi );
          sun.y = Math.sin( phi ) * Math.sin( theta );
          sun.z = Math.sin( phi ) * Math.cos( theta );
    
          if(sky) {
            sky.mesh.material.uniforms[ 'sunPosition' ].value.copy( sun );
            scene.environment = PMREMGenerator.fromScene( sky.mesh ).texture;
          }
        }
      }
     }
   },[figures,world,scene,PMREMGenerator,camera]);

  // useEffect(()=> {
  // const removeBodies = () => {
  //   bodiesToRemove.forEach(body => {
  //     world.remove(body);
  //     body.meshRef.geometry.dispose()
  //     body.meshRef.material.dispose()
  //     scene.remove(body.meshRef);
  //   })
  //   setBodiesToRemove([]);
  // }
  // removeBodies();
  // },[bodiesToRemove]);

  // list of figures to load initially


  // useEffect(()=> {
  //   const removeBodies = () => {
  //     bodiesToRemove.forEach(body => {
  //       world.remove(body);
  //       body.meshRef.geometry.dispose()
  //       body.meshRef.material.dispose()
  //       scene.remove(body.meshRef);
  //     })
  //     setBodiesToRemove([]);
  //   }
  //   removeBodies();
  // },[bodiesToRemove]);

  const endGame = () => {
    setGameOver(true);
    //probably do other things too like clean up, scoreboard
  }
  
  const restart = (figures) => {
    console.log(shouldRestart);
    console.log(figures);
    figures.forEach(fig => {
      console.log(fig);
      world.remove(fig.body);
      fig.mesh.geometry.dispose()
      fig.mesh.material.dispose()
      scene.remove(fig.mesh);
    })
    setShouldRestart(true);

  }

  const gameOverStyle = {
    backgroundColor: 'white',
    height: '200px',
    width: '200px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    /* bring your own prefixes */
    transform: 'translate(-50%, -50%)'
  }
  return (
    <div>

    <GameOverMenu gameOver={gameOver} restart={() => {restart(figures)}}></GameOverMenu>
    <div ref={ref => (rootRef = ref)}>
    </div>
    </div>
  );
}

export default App;
