const fabric = window.fabric

export default class MountPlate {
    constructor() {
        this._fill = '#b8d4ff'
        this._stroke = 'white'
        this._strokeWidth = 2

        return this._generateMountPlate()
    }

    _generateMountPlate() {
        const mountPlate = new fabric.Rect({
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            opacity: 0.6,
            evented: false
        })

        return mountPlate
    }
}
