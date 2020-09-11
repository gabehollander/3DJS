import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util'

const createPlayer = () => {
    const playerShape = new CANNON.Sphere(5);
    const playerBody = new CANNON.Body({
    mass: 10
    });
    playerBody.addShape(playerShape);
    playerBody.position.set(0,15,0);
    playerBody.linearDamping = 0.5;

    const playerGeometry = new THREE.SphereGeometry( 5, 10, 10 );
    const playerMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    const playerMesh = new THREE.Mesh( playerGeometry, playerMaterial );
    playerMesh.scale.x = 1;
    playerMesh.scale.y = 1;
    playerMesh.scale.z = 1;

    const _handleKeyDown = (event, body) => {
        switch( event.keyCode ) {
          case CONSTANTS.UP:
            body.velocity.z += -1 * CONSTANTS.VELOCITY_MAGNITUDE;
            break;
          case CONSTANTS.DOWN:
            body.velocity.z += 1 * CONSTANTS.VELOCITY_MAGNITUDE;
            break;
          case CONSTANTS.LEFT:
            body.velocity.x += -1 * CONSTANTS.VELOCITY_MAGNITUDE;
            break;
          case CONSTANTS.RIGHT:
            body.velocity.x += 1 * CONSTANTS.VELOCITY_MAGNITUDE;
            break;
          case CONSTANTS.JUMP:
            if (body.velocity.y < 1 && body.velocity.y > -1)
            body.velocity.y += 66;
            break;
          default: 
              break;
        }
    }

    document.addEventListener("keydown", (e) => {
        return _handleKeyDown(e,playerBody)
    });

    return new Figure(playerBody, playerMesh, "player");
}

export default createPlayer;

