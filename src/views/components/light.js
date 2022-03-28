const fabric = window.fabric

export default class Showcase {
    constructor(path) {
        return this._generateLight(path)
    }

    _generateLight(path) {
        const light = new fabric.Path(path, {
            fill: '#ffe433',
            stroke: '#b4b6b4',
            strokeWidth: 2,
            opacity: 0.8,
            evented: false
        })

        return light
    }
}
