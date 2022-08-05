import { Dark } from 'quasar'

const fabric = window.fabric

export default class Ruler {
    constructor(x = 300, y = 200) {
        this._roomFill = Dark.isActive ? '#2c3b4f' : '#ffffff'
        this._roomStroke = Dark.isActive ? '#bde2ff' : '#01003d'
        this._roomStrokeWidth = 2
        this._titleFontSize = 18

        return this._generateRoom(x, y)
    }

    _generateRoom(x, y) {
        const room = new fabric.Rect({
            top: 0,
            left: 0,
            width: x,
            height: y,
            fill: this._roomFill,
            stroke: this._roomStroke,
            strokeWidth: this._roomStrokeWidth,
            evented: false
        })

        return room
    }
}
