export class Figure {
    constructor(body, mesh, name) {
        this.body = body;
        this.mesh = mesh;
        this.name = name;
    }

    // takes an array of functions that create a figure
    static initFigures(scene, world, figures, arr) {

        function initFigure(scene,world,figures,fn) {
            const fig = fn();
            figures.push(fig);
            scene.add(fig.mesh);
            world.addBody(fig.body);
        }
        arr.forEach(fn => {
            initFigure(scene, world, figures, fn);
        })
    }

    
}