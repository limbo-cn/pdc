import { toFixedNumber } from 'src/helper/common'
import store from '../../store'
import Axis from './axis'
import Room from './room'
import RulerH from './ruler/rulerH'
import RulerV from './ruler/rulerV'
import { Platform } from 'quasar'

const fabric = window.fabric

export default class BaseView {
    constructor(domId) {
        this._roomSize = {
            x: 6,
            y: 5,
            drawX: 0,
            drawY: 0,
            ratio: 1
        }
        this._projectorProp = {
            fromScreenMax: 0,
            fromScreenMaxDraw: 0,
            fromScreenMin: 0,
            fromScreenMinDraw: 0
        }

        this._canvas = null
        this._canvasWidth = 0
        this._canvasHeight = 0
        this._room = null
        this._projector = null
        this._projectorCenter = { x: 0, y: 0 }
        this._hAxis = null
        this._vAxis = null
        this._ustAxis = null
        this._rulers = []

        this._rulerTop = null
        this._rulerRight = null
        this._rulerLeft = null
        this._rulerBottom = null

        this._init(domId)
    }

    getDataUrl() {
        return this._canvas.toDataURL()
    }

    _init(domId) {
        this._initCanvas(domId)
    }

    _initCanvas(domId) {
        this._canvas = new fabric.Canvas(domId, {
            selection: false,
            preserveObjectStacking: true,
            renderOnAddRemove: false
        })
    }

    _setViewportTransform() {
        this._canvas.setViewportTransform([1, 0, 0, 1, this._canvasWidth / 2 - this._roomSize.drawX / 2, this._canvasHeight / 2 - this._roomSize.drawY / 2])
    }

    _calcRoomSize() {
        const viewBox = Array.prototype.find.call(document.querySelectorAll('.viewWrapper'), dom => dom.clientHeight > 0).getBoundingClientRect()
        const standardX = viewBox.width - (Platform.is.mobile ? 120 : 200)
        const standardY = viewBox.height - 120

        const ratioX = standardX / this._roomSize.x
        const assumeY = ratioX * this._roomSize.y
        if (assumeY <= standardY) {
            this._roomSize.drawX = standardX
            this._roomSize.drawY = assumeY
            this._roomSize.ratio = ratioX
        } else {
            const ratioY = standardY / this._roomSize.y
            this._roomSize.drawX = ratioY * this._roomSize.x
            this._roomSize.drawY = standardY
            this._roomSize.ratio = ratioY
        }
    }

    _generateRoom() {
        this._disposeRulers()
        this._calcRoomSize()
        this._canvas.remove(this._room)
        this._room = new Room(this._roomSize.drawX, this._roomSize.drawY)
        this._canvas.add(this._room)
    }

    _generateAxis(isUST = false) {
        if ((!isUST && this._hAxis && this._vAxis) || (isUST && this._hAxis && this._vAxis && this._ustAxis)) {
            this._hAxis.setOptions({ top: this._projectorCenter.y, width: this._roomSize.drawX })
            this._vAxis.setOptions({ left: this._projectorCenter.x, height: isUST ? this._projectorCenter.y : this._roomSize.drawY })
            if (isUST) {
                this._ustAxis.setOptions({ left: this._projector.left, top: this._projectorCenter.y, height: this._roomSize.drawY - this._projectorCenter.y })
            } else if (this._ustAxis) {
                this._canvas.remove(this._ustAxis)
                this._ustAxis = null
            }
            return
        } else {
            this._canvas.remove(this._hAxis)
            this._canvas.remove(this._vAxis)
            this._hAxis = null
            this._vAxis = null
        }
        [this._hAxis, this._vAxis, this._ustAxis] = new Axis(this._projectorCenter.x, this._projectorCenter.y, this._roomSize.drawX, isUST ? this._projectorCenter.y : this._roomSize.drawY, isUST)
        this._canvas.add(this._hAxis)
        this._canvas.add(this._vAxis)
        isUST && this._canvas.add(this._ustAxis)
    }

    _generateRulerTop() {
        const optionsTop = {
            length: this._roomSize.drawX,
            marks: [
                { title: `${toFixedNumber(this._projectorCenter.x / this._roomSize.ratio * store.state.common.unitRatio, 3)} (${store.state.common.unitLabel})`, length: this._projectorCenter.x },
                { title: `${toFixedNumber((this._roomSize.drawX - this._projectorCenter.x) / this._roomSize.ratio * store.state.common.unitRatio, 3)} (${store.state.common.unitLabel})`, length: this._roomSize.drawX - this._projectorCenter.x }
            ]
        }
        if (this._rulerTop) {
            this._rulerTop.setOptions(optionsTop)
        } else {
            this._rulerTop = new RulerH(optionsTop)
            const objects = this._rulerTop.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.top -= 30
                } else {
                    o.top -= 10
                }
                this._canvas.add(o)
            })
        }
    }

    _generateRulerRight() {
        const optionsRight = {
            length: this._roomSize.drawY,
            marks: [
                { title: `${toFixedNumber(this._projectorCenter.y / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: this._projectorCenter.y },
                { title: `${toFixedNumber((this._roomSize.drawY - this._projectorCenter.y) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: this._roomSize.drawY - this._projectorCenter.y }
            ]
        }
        if (this._rulerRight) {
            this._rulerRight.setOptions(optionsRight)
        } else {
            this._rulerRight = new RulerV(optionsRight)
            const objects = this._rulerRight.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.left += this._roomSize.drawX + 20
                } else {
                    o.left += this._roomSize.drawX + 10
                }
                this._canvas.add(o)
            })
        }
    }

    _disposeRulers() {
        if (this._rulerTop) {
            this._rulerTop.getObjects().forEach(o => {
                this._canvas.remove(o)
            })
            this._rulerTop = null
        }
        if (this._rulerRight) {
            this._rulerRight.getObjects().forEach(o => {
                this._canvas.remove(o)
            })
            this._rulerRight = null
        }
        if (this._rulerLeft) {
            this._rulerLeft.getObjects().forEach(o => {
                this._canvas.remove(o)
            })
            this._rulerLeft = null
        }
        if (this._rulerBottom) {
            this._rulerBottom.getObjects().forEach(o => {
                this._canvas.remove(o)
            })
            this._rulerBottom = null
        }
    }

    _toDrawSize(point) {
        return {
            x: point.x * this._roomSize.ratio,
            y: point.y * this._roomSize.ratio,
            z: point.z * this._roomSize.ratio
        }
    }

    _rotateObjectByPoint(object, angle, pointX, pointY) {
        const pointToOrigin = Math.sqrt(Math.pow(pointX, 2) + Math.pow(pointY, 2))
        const initAngle = Math.atan(pointY / pointX) * 180 / Math.PI
        const offsetX = Math.cos((angle + initAngle) * Math.PI / 180) * pointToOrigin
        const offsetY = Math.sin((angle + initAngle) * Math.PI / 180) * pointToOrigin
        object.setOptions({ left: this._projectorCenter.x - offsetX, top: this._projectorCenter.y - offsetY, angle: angle })
        object.setCoords()
    }
}
