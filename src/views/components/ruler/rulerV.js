import RulerBase from './rulerBase'

const fabric = window.fabric

export default class RulerV extends RulerBase {
    constructor(options = {}) {
        super(options)
        this._generateRuler(options)
    }

    setOptions(options) {
        this._linePath.height = options.length
        this._markEnd.top = options.length
        const _this = this
        options.marks.reduce((startLength, mark, index) => {
            _this._titleObjects[index].text = mark.title
            _this._titleObjects[index].top = (mark.length - 9) / 2 + startLength
            _this._titleObjects[index].opacity = 1
            _this._markObjects[index].top = mark.length + startLength
            _this._markObjects[index].opacity = 1
            return startLength + mark.length
        }, 0)
        this._titleObjects.forEach((o, index) => {
            if (index >= options.marks.length) {
                o.opacity = 0
            }
        })
        this._markObjects.forEach((o, index) => {
            if (index >= options.marks.length) {
                o.opacity = 0
            }
        })
    }

    _generateRuler(options) {
        const linePath = [0, 0, 0, 0]
        this._linePath = new fabric.Line(linePath, {
            top: 0,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            evented: false
        })

        const markStartPath = [-this._markWidth / 2, 0, this._markWidth / 2 + 2, 0]
        this._markStart = new fabric.Line(markStartPath, {
            left: -5,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            evented: false
        })

        const markEndPath = [-this._markWidth / 2, 0, this._markWidth / 2 + 2, 0]
        this._markEnd = new fabric.Line(markEndPath, {
            left: -5,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            evented: false
        })

        for (let i = 0; i < 5; i++) {
            const titleObject = new fabric.Text('123', {
                fontSize: this._titleFontSize,
                fill: this._stroke,
                fontFamily: 'delta-font',
                evented: false
            })
            this._titleObjects.push(titleObject)
        }

        for (let i = 0; i < 5; i++) {
            const markObjectPath = [-this._markWidth / 2, 0, this._markWidth / 2 + 2, 0]
            const markObject = new fabric.Line(markObjectPath, {
                left: -5,
                stroke: this._stroke,
                strokeWidth: this._strokeWidth,
                evented: false
            })
            this._markObjects.push(markObject)
        }

        this.setOptions(options)
    }
}
