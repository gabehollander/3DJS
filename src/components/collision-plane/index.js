import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';

const createCollisionPlane = (removeBody, endGame) => {

    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    collisionFilterGroup: 2, // Put plane in group 2
    collisionFilterMask: 2, // It can only collide with group 2
    });
    planeBody.addShape(planeShape);
    planeBody.position.set(0,-40,0);
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    var planeGeometry = new THREE.PlaneGeometry(15000,15000,8,8),
    planeMaterial = new THREE.MeshBasicMaterial( {color: 0xFFF,wireframe: true} );
    const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    planeMesh.receiveShadow = true;
    planeBody.meshRef = planeMesh;

    planeBody.addEventListener("collide",function(e){
        setTimeout(() => {
            removeBody(e.body,e.meshRef)
            endGame();
        },0)
    });

    return new Figure(planeBody, planeMesh, "collision-plane");
}

export default createCollisionPlane;