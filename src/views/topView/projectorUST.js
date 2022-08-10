const fabric = window.fabric

export const projectorRect = {
    camera: { x: 10, y: 10 },
    body: { x: 10, y: 40 }
}

export default class Projector {
    constructor() {
        this._projectorFill = 'rgb(89,89,89)'
        this._projectorStroke = 'rgb(181,181,182)'
        this._projectorStrokeWidth = 2

        // return this._generateProjector()
        this._generateProjector2().then(projector => {
            this._projector = projector
        })

        this.xOffset = 10
        this.yOffset = 10
    }

    _generateProjector(x, y) {
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

        const projector = new fabric.Group([body, camera], {
            left: 0,
            top: 0
        })

        return projector
    }

    _generateProjector2(isReverse) {
        const projectorImage = require('../../assets/icon_ultra_short_throw_projector_top.svg')

        const promise = new Promise(function(resolve, reject) {
            fabric.loadSVGFromURL(projectorImage, (objects, options) => {
                const img = fabric.util.groupSVGElements(objects, options)

                img.left = 0
                img.top = 0

                img.scaleX = 0.5
                img.scaleY = 0.6

                resolve(img)
            })
        })

        return promise
    }
}
