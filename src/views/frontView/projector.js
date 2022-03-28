const fabric = window.fabric

export const projectorRect = {
    camera: { x: 8, y: 10 },
    body: { x: 40, y: 20 }
}

export default class Projector {
    constructor() {
        this._projectorFill = '#7cbf87'
        this._projectorStroke = '#487b52'
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
