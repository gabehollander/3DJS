import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util'

const createCube = (position) => {
    const cubeScale = 1;

    const cubeShape = new CANNON.Box(new CANNON.Vec3(5, 5, 5));
    const cubeBody = new CANNON.Body({
    mass: 10
    });
    cubeBody.addShape(cubeShape);
    cubeBody.position.set(position.x,position.y,position.z);
    cubeBody.linearDamping = 0.5;

    const cubeGeometry = new THREE.BoxGeometry( 10,10,10 );
    const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    const cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cubeMesh.scale.x = cubeScale;
    cubeMesh.scale.y = cubeScale;
    cubeMesh.scale.z = cubeScale;

    return new Figure(cubeBody, cubeMesh, "cube");
}

export default createCube;

