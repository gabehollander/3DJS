import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util'

const createPlatform = () => {

    const platformShape = new CANNON.Box(new CANNON.Vec3(48, 48, 2.5));
    const platformBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    collisionFilterGroup: 2, // Put plane in group 2
    collisionFilterMask: 6 // It can only collide with group 2
    });
    platformBody.addShape(platformShape);
    // groundBody.position.set(0,5,0);
    platformBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    var platformGeometry = new THREE.BoxGeometry(CONSTANTS.PLATFORM_SIZE, CONSTANTS.PLATFORM_SIZE, 5),
    platformMaterial = new THREE.MeshBasicMaterial( {color: 0xFFF,wireframe: true} );
    const platformMesh = new THREE.Mesh( platformGeometry, platformMaterial );
    platformMesh.receiveShadow = true;

    return new Figure(platformBody, platformMesh, "platform");
}

export default createPlatform;