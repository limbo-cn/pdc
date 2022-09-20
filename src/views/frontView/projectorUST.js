const fabric = window.fabric

export default class Projector {
    constructor() {
        this._generateProjector().then(projector => {
            this._projector = projector
        })

        this.xOffset = 30
        this.yOffset = 16
        this.yOffsetCeil = 30
    }

    _generateProjector(isReverse) {
        const projectorImage = require('../../assets/icon_ultra_short_throw_projector_front.svg')

        const promise = new Promise(function(resolve, reject) {
            fabric.loadSVGFromURL(projectorImage, (objects, options) => {
                const img = fabric.util.groupSVGElements(objects, options)

                img.left = 0
                img.top = 0

                resolve(img)
            })
        })

        return promise
    }
}
