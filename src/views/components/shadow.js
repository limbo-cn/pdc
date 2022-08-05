const fabric = window.fabric

export default class Shadow {
    constructor(path) {
        return this._generateShadow(path)
    }

    _generateShadow(path) {
        const shadow = new fabric.Path(path, {
            fill: 'rgb(255,145,110)',
            opacity: 0.8,
            stroke: 'rgb(255,145,110)',
            strokeWidth: 1,
            evented: false
        })

        return shadow
    }
}
