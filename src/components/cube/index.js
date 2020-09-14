import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';

const createCube = (position) => {
    const cubeScale = 1;
    const cubeSize = 20

    const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize/2, cubeSize/2, cubeSize/2));
    const cubeBody = new CANNON.Body({
    mass: 10,
    collisionFilterGroup: 4, // Put plane in group 2
    collisionFilterMask: 6 // It can only collide with group 2
    });
    cubeBody.addShape(cubeShape);
    cubeBody.position.set(position.x,position.y,position.z);
    cubeBody.linearDamping = 0.5;

    const cubeGeometry = new THREE.BoxGeometry( cubeSize,cubeSize,cubeSize );
    const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    const cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cubeMesh.scale.x = cubeScale;
    cubeMesh.scale.y = cubeScale;
    cubeMesh.scale.z = cubeScale;

    cubeBody.meshRef = cubeMesh;

    return new Figure(cubeBody, cubeMesh, "cube");
}

export default createCube;

