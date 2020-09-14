import * as THREE from 'three';
import * as CANNON from 'cannon';
import { Figure } from '../../library/figure';
import { Water } from 'three/examples/js/objects/Water'


const createWater = () => {

     const waterShape = new CANNON.Plane();
     const waterBody = new CANNON.Body({ 
        mass: 0, 
        collisionFilterGroup: 1, // Put plane in group 1
        collisionFilterMask: 1, // It can only collide with group 1
    });
     waterBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
     waterBody.position.set(0,-30,0);


     waterBody.addShape(waterShape);

    var geo = new THREE.PlaneBufferGeometry(15000, 15000, 10, 10);

    const waterMesh = new Water( geo, {
      textureWidth: 204,
      textureHeight: 204,
      waterNormals: new THREE.TextureLoader().load( 
        'https://www.titansoftime.com/textures/water/waternormals.jpg',
        function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        } 
      ),
      alpha: 0.01,
      fog: true,
      distortionScale: 10.0,
      sunDirection: new THREE.Vector3(),
      sunColor: 0x73a9ff,
      waterColor: 0x73a9ff,
      side: THREE.DoubleSide
    });

    waterMesh.rotation.x = - Math.PI * 0.5;


    return new Figure(waterBody, waterMesh, "water");
}

export default createWater;