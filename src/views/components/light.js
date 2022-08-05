const fabric = window.fabric

export default class Showcase {
    constructor(path) {
        return this._generateLight(path)
    }

    _generateLight(path) {
        const light = new fabric.Path(path, {
            fill: 'rgb(255,241,193)',
            stroke: 'rgb(255,241,193)',
            strokeWidth: 1,
            opacity: 0.8,
            evented: false
        })

        return light
    }
}
