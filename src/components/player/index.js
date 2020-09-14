import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util'

const createPlayer = (camera) => {

  const keys = {
    "ArrowUp": false,
    "ArrowDown": false,
    "ArrowLeft": false,
    "ArrowRight": false,
    " ": false
  }

  const playerShape = new CANNON.Sphere(5);
  const playerBody = new CANNON.Body({
    mass: 10,
    collisionFilterGroup: 2, // Put plane in group 2
    collisionFilterMask: 6, // It can only collide with group 2
  });
  playerBody.addShape(playerShape);
  playerBody.position.set( 0, 15, 0 );
  playerBody.linearDamping = 0.5;

  const playerGeometry = new THREE.SphereGeometry( 5, 10, 10 );
  const playerMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  const playerMesh = new THREE.Mesh( playerGeometry, playerMaterial );
  playerMesh.scale.x = 1;
  playerMesh.scale.y = 1;
  playerMesh.scale.z = 1;

  playerBody.meshRef = playerMesh;

  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    keys[e.key] = true;
  });
  document.addEventListener("keyup", (e) => {
    e.preventDefault();
    keys[e.key] = false;
  });

  const handlePlayerMovement = () => {

    let orth;
    const dir = new THREE.Vector3(playerBody.position.x, playerBody.position.y, playerBody.position.z);

    /* 
    this is some vector math to make sure that all directions are always relative to the camera.
    we do this by passing the camera in as a parameter to this component, and finding the direction
    between the camera and the ball. Then we add velocity along this vector for forwards and backwards,
    and add velocity along an orthogonal vector for left and right.  
    */

    dir.sub(camera.position).normalize(); // direction vector between the camera and the ball
    if (keys['ArrowUp']) {
      playerBody.velocity.x += CONSTANTS.VELOCITY_MAGNITUDE * dir.x
      playerBody.velocity.z += CONSTANTS.VELOCITY_MAGNITUDE * dir.z
    }
    if (keys['ArrowDown']) {
      playerBody.velocity.x += (CONSTANTS.VELOCITY_MAGNITUDE * dir.x) * -1
      playerBody.velocity.z += (CONSTANTS.VELOCITY_MAGNITUDE * dir.z) * -1
    }
    if (keys['ArrowLeft']) {
      orth = dir.cross(new THREE.Vector3(0, 1, 0)).normalize();
      playerBody.velocity.x += (CONSTANTS.VELOCITY_MAGNITUDE * orth.x) * -1
      playerBody.velocity.z += (CONSTANTS.VELOCITY_MAGNITUDE * orth.z) * -1
    }
    if (keys['ArrowRight']) {
      orth = dir.cross(new THREE.Vector3(0, 1, 0)).normalize();
      playerBody.velocity.x += CONSTANTS.VELOCITY_MAGNITUDE * orth.x
      playerBody.velocity.z += CONSTANTS.VELOCITY_MAGNITUDE * orth.z
    }
    if (keys[' ']) {
      if (playerBody.velocity.y < 1 && playerBody.velocity.y > -1)
      playerBody.velocity.y += 66 ;
    }
  }

  return new Figure(playerBody, playerMesh, "player",{handlePlayerMovement});
}

export default createPlayer;

