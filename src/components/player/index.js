import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util'

const createPlayer = () => {
    const playerShape = new CANNON.Sphere(10);
    const playerBody = new CANNON.Body({
    mass: 50
    });
    playerBody.addShape(playerShape);
    playerBody.position.set(0,15,0);
    playerBody.linearDamping = 0.5;

    const playerGeometry = new THREE.SphereGeometry( 1, 10, 10 );
    const playerMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    const playerMesh = new THREE.Mesh( playerGeometry, playerMaterial );
    playerMesh.scale.x = 10;
    playerMesh.scale.y = 10;
    playerMesh.scale.z = 10;

    const _handleKeyDown = (event, body) => {
        switch( event.keyCode ) {
          case CONSTANTS.UP:
            body.velocity.z += -3;
            break;
          case CONSTANTS.DOWN:
            body.velocity.z += 3;
            break;
          case CONSTANTS.LEFT:
            body.velocity.x += -3;
            break;
          case CONSTANTS.RIGHT:
            body.velocity.x += 3;
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

