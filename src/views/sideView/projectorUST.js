const fabric = window.fabric

export const projectorRect = {
    camera: { x: 10, y: 10 },
    body: { x: 10, y: 10 }
}

export default class Projector {
    constructor(optionals) {
        optionals = optionals || {}

        this._projectorFill = 'rgb(89,89,89)'
        this._projectorStroke = 'rgb(181,181,182)'
        this._projectorStrokeWidth = 2

        // return this._generateProjector(optionals)

        this._generateProjector2().then(projector => {
            this._projector = projector
        })

        this.xOffset = 12
        this.yOffset = 8
        this.yOffsetCeil = 20
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

    _generateProjector2(isReverse) {
        const projectorImage = require('../../assets/icon_ultra_short_throw_projector_side.svg')

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
