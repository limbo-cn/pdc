const fabric = window.fabric

export default class Shadow {
    constructor(path) {
        return this._generateShadow(path)
    }

    _generateShadow(path) {
        const shadow = new fabric.Path(path, {
            fill: '#fb6b6b',
            opacity: 0.8,
            stroke: '#fd4141',
            strokeWidth: 4,
            evented: false
        })

        return shadow
    }
}
