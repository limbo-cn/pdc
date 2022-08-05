const fabric = window.fabric

export default class Axis {
    constructor(x, y, width, hegiht, isUST) {
        this._axistroke = 'rgb(181,181,182)'
        this._axisStrokeWidth = 2
        this._axisDashArray = [3, 3]

        return this._generateAxis(x, y, width, hegiht, isUST)
    }

    _generateAxis(x, y, width, height, isUST) {
        const hAxis = new fabric.Line([0, 0, width, 0], {
            top: y,
            stroke: this._axistroke,
            strokeWidth: this._axisStrokeWidth,
            strokeDashArray: this._axisDashArray,
            evented: false
        })

        const vAxis = new fabric.Line([0, 0, 0, height], {
            left: x,
            stroke: this._axistroke,
            strokeWidth: this._axisStrokeWidth,
            strokeDashArray: this._axisDashArray,
            evented: false
        })

        const ustAxis = isUST ? new fabric.Line([0, 0, 0, height], {
            left: x,
            stroke: this._axistroke,
            strokeWidth: this._axisStrokeWidth,
            strokeDashArray: this._axisDashArray,
            evented: false
        }) : null

        return [hAxis, vAxis, ustAxis]
    }
}
