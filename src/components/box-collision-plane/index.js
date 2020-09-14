import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';

const createBoxCollisionPlane = (removeBody) => {

    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    collisionFilterGroup: 4, // Put plane in group 2
    collisionFilterMask: 4, // It can only collide with group 2
    });
    planeBody.addShape(planeShape);
    planeBody.position.set(0,-75,0);
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    var planeGeometry = new THREE.PlaneGeometry(15000,15000,8,8),
    planeMaterial = new THREE.MeshBasicMaterial( {color: 0x00F,wireframe: true} );
    const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    planeMesh.receiveShadow = true;
    planeBody.meshRef = planeMesh;

    planeBody.addEventListener("collide",function(e){
        removeBody(e.body,e.meshRef)
    });

    return new Figure(planeBody, planeMesh, "box-collision-plane");
}

export default createBoxCollisionPlane;