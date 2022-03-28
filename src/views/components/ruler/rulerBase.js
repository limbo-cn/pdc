import { getTextWidth } from '../../../helper/common'
import { Dark } from 'quasar'

export default class RulerBase {
    constructor(options = {}) {
        this._marks = options.marks || [] // {title:``,length:10}
        this._length = options.length || 100

        this._markStart = null
        this._linePath = null
        this._markEnd = null
        this._markObjects = []
        this._titleObjects = []

        this._stroke = Dark.isActive ? '#bde2ff' : '#686868'
        this._strokeWidth = 2
        this._markWidth = 10
        this._titleFontSize = 18
    }

    getLeftMarkOffset(marks) {
        let longestTitle = 0
        marks.forEach(mark => {
            const titleLength = getTextWidth(mark.title, `${this._titleFontSize}px arial`)
            titleLength > longestTitle && (longestTitle = titleLength)
        })
        return -longestTitle - 30
    }

    getObjects() {
        return [this._linePath, this._markStart, this._markEnd, ...this._markObjects, ...this._titleObjects]
    }
}
