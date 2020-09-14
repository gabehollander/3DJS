export class Figure {
    constructor(body, mesh, name, fns = null) {
        this.body = body;
        this.mesh = mesh;
        this.name = name;
        this.fns = fns;
    }

    // takes an array of functions that create a figure
    static initFigures(scene, world, arr, addFigure) {

        const tmp = [];

        function initFigure(scene, world, fn, addFigure) {
            const fig = fn();
            addFigure(fig);
            scene.add(fig.mesh);
            if (fig.body) {
                world.addBody(fig.body);
            }
            tmp.push(fig);
        }
        arr.forEach(fn => {
            initFigure(scene, world, fn, addFigure);
        })
        addFigure(tmp);


    }

    
}