const fabric = window.fabric

export const projectorRect = {
    camera: { x: 12, y: 10 },
    body: { x: 40, y: 20 }
}

export default class Projector {
    constructor(optionals) {
        optionals = optionals || {}

        this._projectorFill = '#7cbf87'
        this._projectorStroke = '#487b52'
        this._projectorStrokeWidth = 2

        return this._generateProjector(optionals)
    }

    _generateProjector(optionals) {
        const body = new fabric.Rect({
            top: 0,
            left: 0,
            width: projectorRect.body.x,
            height: projectorRect.body.y,
            fill: this._projectorFill,
            stroke: this._projectorStroke,
            strokeWidth: this._projectorStrokeWidth
        })

        const camera = new fabric.Rect({
            top: (projectorRect.body.y - projectorRect.camera.y) / 2,
            left: projectorRect.body.x,
            width: projectorRect.camera.x,
            height: projectorRect.camera.y,
            fill: this._projectorFill,
            stroke: this._projectorStroke,
            strokeWidth: this._projectorStrokeWidth
        })

        const isReverse = !!optionals.isReverse
        let lens
        if (isReverse) {
            lens = new fabric.Triangle({
                top: (projectorRect.body.y - projectorRect.camera.y) / 2 + projectorRect.camera.y,
                left: projectorRect.body.x,
                width: projectorRect.camera.x,
                height: projectorRect.camera.y,
                fill: this._projectorFill,
                stroke: this._projectorStroke,
                strokeWidth: this._projectorStrokeWidth
            })
            lens.rotate(180)
        } else {
            lens = new fabric.Triangle({
                top: (projectorRect.body.y - projectorRect.camera.y) / 2 - projectorRect.camera.y,
                left: projectorRect.body.x,
                width: projectorRect.camera.x,
                height: projectorRect.camera.y,
                fill: this._projectorFill,
                stroke: this._projectorStroke,
                strokeWidth: this._projectorStrokeWidth
            })
        }

        const projector = new fabric.Group([body, camera, lens], {
            left: 0,
            top: 0
        })

        return projector
    }
}
