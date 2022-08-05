const fabric = window.fabric

export const projectorRect = {
    camera: { x: 8, y: 10 },
    body: { x: 40, y: 20 }
}

export default class Projector {
    constructor() {
        this._projectorFill = 'rgb(89,89,89)'
        this._projectorStroke = 'rgb(181,181,182)'
        this._projectorStrokeWidth = 2

        return this._generateProjector()
    }

    _generateProjector(x, y) {
        const projector = new fabric.Rect({
            top: 0,
            left: 0,
            width: projectorRect.body.x,
            height: projectorRect.body.y,
            fill: this._projectorFill,
            stroke: this._projectorStroke,
            strokeWidth: this._projectorStrokeWidth
        })

        return projector
    }
}
