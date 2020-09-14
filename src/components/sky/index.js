import { Figure } from '../../library/figure';
import { Sky } from 'three/examples/jsm/objects/Sky';


const createSky = () => {

       var skyMesh = new Sky();
       skyMesh.scale.setScalar( 10000 );

       var uniforms = skyMesh.material.uniforms;

       uniforms[ 'turbidity' ].value = 10;
       uniforms[ 'rayleigh' ].value = 2;
       uniforms[ 'mieCoefficient' ].value = 0.005;
       uniforms[ 'mieDirectionalG' ].value = 0.8;


    return new Figure(null, skyMesh, "sky");
}

export default createSky;