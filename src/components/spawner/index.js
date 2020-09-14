import createCube from '../cube'
import { Figure } from '../../library/figure';
import { CONSTANTS } from '../../library/util';

export const createSpawner = (world, scene, addFigure) => {

    setInterval(() => {
        spawnFigure()}, 3000
    )

    const spawnFigure = () => {
        const x = (Math.floor(Math.random() * CONSTANTS.PLATFORM_SIZE)) - (CONSTANTS.PLATFORM_SIZE/2);
        const z = (Math.floor(Math.random() * CONSTANTS.PLATFORM_SIZE)) - (CONSTANTS.PLATFORM_SIZE/2);
        const y = 50;
        Figure.initFigures(scene, world, [createCube.bind(null,{x,y,z})], addFigure);
    }

}