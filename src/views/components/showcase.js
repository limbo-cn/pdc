const fabric = window.fabric

export default class Showcase {
    constructor(pointStart, pointEnd) {
        return this._generateShowcase(pointStart, pointEnd)
    }

    _generateShowcase(pointStart, pointEnd) {
        const showcase = new fabric.Line([pointStart.x, pointStart.y, pointEnd.x, pointEnd.y], {
            stroke: '#6bccff',
            strokeWidth: 4,
            evented: false
        })

        return showcase
    }
}
