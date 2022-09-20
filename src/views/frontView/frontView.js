import store from '../../store'
import bus from '../../helper/bus'
import { toFixedNumber } from '../../helper/common'

import Projector, { projectorRect } from './projector'
import ProjectorUST from './projectorUST'
import BaseView from '../components/baseView'
import Light from '../components/light'
import MountPlate from '../components/mountPlate'
import RulerH from '../components/ruler/rulerH'
import RulerV from '../components/ruler/rulerV'
import { installationType, unitRatio } from 'src/helper/enum'

const fabric = window.fabric

export default class FrontView extends BaseView {
    constructor(domId) {
        super(domId)

        this._isMoving = false
        this._light = null
        this._lightCurrentAspectRatio = null
        this._diagonal = null
        this._mountPlate = null
        this._mountPlateTitle = null

        this._movableArea = null

        this.ustModel = new ProjectorUST()
    }

    setProjectorProp() {
        this._projectorCenter.x = store.state.projector.fromLeftside * this._roomSize.ratio
        this._projectorCenter.y = this._roomSize.drawY - store.state.projector.fromFloor * this._roomSize.ratio

        this._setProjectorOffset()
        this._generateObjects()
    }

    _initRoom() {
        this._roomSize.x = store.state.room.width
        this._roomSize.y = store.state.room.height
        this._generateRoom()
    }

    _initProjector() {
        if (this._projector) {
            this._canvas.remove(this._projector)
            this._projector = null
        }

        const isReverse = store.state.common.installation === installationType.ceiling
        this._projector = store.state.projector.isUST ? this.ustModel._projector : new Projector()
        this._projector.flipY = isReverse
        const _this = this
        this._projector.on({
            'moving'(e) {
                _this._movingProjector(e)
            },
            'selected'() {
                store.commit('common/SET_SELECTED_VIEW', 'FrontView')
                bus.$emit('changeView', 'FrontView')
            }
        })
        bus.$on('changeView', view => {
            if (view !== 'FrontView') {
                _this._canvas.discardActiveObject()
                _this._canvas.requestRenderAll()
            }
        })

        this._canvas.add(this._projector)
    }

    _movingProjector(e) {
        const isReverse = store.state.common.installation === installationType.ceiling
        this._projectorCenter.x = e.transform.target.left + (store.state.projector.isUST ? this.ustModel.xOffset : projectorRect.body.x / 2)
        if (this._projectorCenter.x <= 0) {
            this._projectorCenter.x = 0
        }
        if (this._projectorCenter.x >= this._roomSize.drawX) {
            this._projectorCenter.x = this._roomSize.drawX
        }
        this._projectorCenter.y = e.transform.target.top + (store.state.projector.isUST ? (isReverse ? this.ustModel.yOffsetCeil : this.ustModel.yOffset) : projectorRect.body.y / 2)
        if (this._projectorCenter.y <= 0) {
            this._projectorCenter.y = 0
        }
        if (this._projectorCenter.y >= this._roomSize.drawY) {
            this._projectorCenter.y = this._roomSize.drawY
        }
        this._dispatchPosition()
    }

    _dispatchPosition() {
        store.dispatch('projector/setFromFloor', toFixedNumber((this._roomSize.drawY - this._projectorCenter.y) / this._roomSize.ratio, 3))
        store.dispatch('projector/setFromLeftside', toFixedNumber(this._projectorCenter.x / this._roomSize.ratio, 3))
        bus.$emit('setProjectorProp')
    }

    _setCanvasCenter() {
        this._setViewportTransform()
        this._setProjectorOffset()
    }

    _setProjectorOffset() {
        if (store.state.projector.isUST) {
            const isReverse = store.state.common.installation === installationType.ceiling
            !isReverse && this._projector.setOptions({ left: this._projectorCenter.x - this.ustModel.xOffset, top: this._projectorCenter.y - this.ustModel.yOffset })
            isReverse && this._projector.setOptions({ left: this._projectorCenter.x - this.ustModel.xOffset, top: this._projectorCenter.y - this.ustModel.yOffsetCeil })
        } else {
            this._projector.setOptions({ left: this._projectorCenter.x - projectorRect.body.x / 2, top: this._projectorCenter.y - projectorRect.body.y / 2 })
        }
        this._projector.setCoords()
    }

    _generateLightArea() {
        this._light && this._canvas.remove(this._light)

        const frontPoints = store.state.coordinate.frontPoints.map(point => this._toDrawSize(point))
        if (frontPoints.length === 0) {
            this._light = null
            return
        }

        let path = ''
        frontPoints.forEach((point, index) => {
            path += `${index === 0 ? 'M' : 'L'} ${-point.x} ${this._roomSize.drawY - point.y} `
        })
        path += 'Z'

        this._light = new Light(path)
        this._light.stroke = '#6bccff'
        this._light.fill = '#6bccff'
        this._light.opacity = 1

        if (store.state.screen.currentAspectRatio !== store.state.screen.aspectRatio) {
            this._light.fill = '#aaaaaa'
        }

        this._canvas.add(this._light)
    }

    _generateDiagonal() {
        this._diagonal && this._canvas.remove(this._diagonal)

        const frontPoints = store.state.coordinate.frontPoints.map(point => this._toDrawSize(point))
        const xArray = frontPoints.map(o => -o.x)
        const yArray = frontPoints.map(o => o.y)
        let left = Math.min(...xArray)
        let right = Math.max(...xArray)
        let top = Math.max(...yArray)
        let bottom = Math.min(...yArray)
        if (store.state.screen.currentAspectRatio !== store.state.screen.aspectRatio) {
            const aspectRatioPoints = store.state.coordinate.aspectRatioPoints
            left = Math.min(-aspectRatioPoints.lt.x, -aspectRatioPoints.lb.x) * this._roomSize.ratio
            right = Math.max(-aspectRatioPoints.rt.x, -aspectRatioPoints.rb.x) * this._roomSize.ratio
            top = Math.max(aspectRatioPoints.rt.y, aspectRatioPoints.lt.y) * this._roomSize.ratio
            bottom = Math.min(aspectRatioPoints.rb.y, aspectRatioPoints.lb.y) * this._roomSize.ratio
        }

        const screenDiagonal = Math.sqrt(Math.pow(right - left, 2) + Math.pow(bottom - top, 2)) / this._roomSize.ratio
        const diagonal = toFixedNumber(screenDiagonal * unitRatio.inch, 1)
        const fontSize = this._light?.width / 5 > 30 ? 30 : ((this._light?.width / 5) < 10 ? 10 : (this._light?.width / 5))

        this._diagonal = new fabric.Text(`${diagonal}''`, {
            fontSize: fontSize,
            fontWeight: 'bold',
            fill: 'black',
            backgroundColor: 'transparent',
            fontFamily: 'delta-font',
            evented: false,
            left: this._light?.left + 5,
            top: this._light?.top + 5
        })

        this._canvas.add(this._diagonal)
    }

    _generateMountPlate() {
        this._mountPlate && this._canvas.remove(this._mountPlate)
        this._mountPlateTitle && this._canvas.remove(this._mountPlateTitle)

        if (store.state.common.installation !== installationType.ceiling || !store.state.projector.isUST || !!store.getters['dataSource/selectedLens']) {
            this._mountPlate = null
            this._mountPlateTitle = null
            this._projector.opacity = 1
            return
        }

        this._mountPlate = new MountPlate()

        const plateSize = {
            x: 17.48 / unitRatio.inch,
            y: 8.07 / unitRatio.inch
        }

        this._mountPlate.width = this._roomSize.drawX * (plateSize.x / this._roomSize.x)
        this._mountPlate.height = this._roomSize.drawY * (plateSize.y / this._roomSize.y)
        this._mountPlate.left = this._projectorCenter.x - this._mountPlate.width / 2

        const vOffset = store.state.screen.width / 2 * store.state.projector.throwRatio
        this._mountPlate.top = this._light.top - vOffset * this._roomSize.ratio - this._mountPlate.height

        const tOffset = toFixedNumber(this._mountPlate.top / this._roomSize.ratio * store.state.common.unitRatio, 3)
        this._mountPlateTitle = new fabric.Text(`${tOffset}`, {
            fontSize: 18,
            fill: '#bde2ff',
            evented: false
        })

        this._mountPlateTitle.left = this._projectorCenter.x + 5
        this._mountPlateTitle.top = this._mountPlate.top / 2 - 9

        this._canvas.add(this._mountPlateTitle)
        this._canvas.add(this._mountPlate)
        this._projector.opacity = 0.6
    }

    _generateRuler() {
        this._generateRulerTop()
        this._generateRulerRight()

        const frontPoints = store.state.coordinate.frontPoints.map(point => this._toDrawSize(point))
        const xArray = frontPoints.map(o => -o.x)
        const yArray = frontPoints.map(o => o.y)
        let left = Math.min(...xArray)
        let right = Math.max(...xArray)
        let top = Math.max(...yArray)
        let bottom = Math.min(...yArray)
        if (store.state.screen.currentAspectRatio !== store.state.screen.aspectRatio) {
            const aspectRatioPoints = store.state.coordinate.aspectRatioPoints
            left = Math.min(-aspectRatioPoints.lt.x, -aspectRatioPoints.lb.x) * this._roomSize.ratio
            left < 0 && (left = 0)
            right = Math.max(-aspectRatioPoints.rt.x, -aspectRatioPoints.rb.x) * this._roomSize.ratio
            right > this._roomSize.drawX && (right = this._roomSize.drawX)
            top = Math.max(aspectRatioPoints.rt.y, aspectRatioPoints.lt.y) * this._roomSize.ratio
            top > this._roomSize.drawY && (top = this._roomSize.drawY)
            bottom = Math.min(aspectRatioPoints.rb.y, aspectRatioPoints.lb.y) * this._roomSize.ratio
            bottom < 0 && (bottom = 0)
        }

        const leftMarks = []
        if (this._light) {
            const topGap = this._roomSize.drawY - top
            if (topGap > 0) {
                leftMarks.push({ title: `${toFixedNumber(topGap / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: topGap })
            }
            leftMarks.push({ title: `${toFixedNumber((top - bottom) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: top - bottom })
            if (bottom > 0) {
                store.commit('screen/SET_FROM_FLOOR', bottom / this._roomSize.ratio)
                leftMarks.push({ title: `${toFixedNumber(bottom / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: bottom })
            }
        }
        const optionsLeft = {
            length: this._roomSize.drawY,
            marks: leftMarks
        }
        if (this._rulerLeft) {
            this._rulerLeft.setOptions(optionsLeft)
            const objects = this._rulerLeft.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.left = this._rulerLeft.getLeftMarkOffset(optionsLeft.marks) + 15
                }
            })
        } else {
            this._rulerLeft = new RulerV(optionsLeft)
            const objects = this._rulerLeft.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.left += this._rulerLeft.getLeftMarkOffset(optionsLeft.marks) + 15
                } else {
                    o.left -= 10
                }
                this._canvas.add(o)
            })
        }

        const bottomMarks = []
        if (this._light) {
            if (left > 0) {
                store.commit('screen/SET_FROM_LEFT', left / this._roomSize.ratio)
                bottomMarks.push({ title: `${toFixedNumber(left / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: left })
            }
            bottomMarks.push({ title: `${toFixedNumber((right - left) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: right - left })
            const rightGap = this._roomSize.drawX - right
            if (rightGap > 0) {
                bottomMarks.push({ title: `${toFixedNumber(rightGap / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: rightGap })
            }
        }
        const options = {
            length: this._roomSize.drawX,
            marks: bottomMarks
        }
        if (this._rulerBottom) {
            this._rulerBottom.setOptions(options)
        } else {
            this._rulerBottom = new RulerH(options)
            const objects = this._rulerBottom.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.top += this._roomSize.drawY + 15
                } else {
                    o.top += this._roomSize.drawY + 10
                }
                this._canvas.add(o)
            })
        }
    }

    _generateMovableArea() {
        this._movableArea && this._canvas.remove(this._movableArea)

        if (!store.state.coordinate.movableAreaPoints.lt || !store.state.coordinate.movableAreaPoints.rt || !store.state.coordinate.movableAreaPoints.rb || !store.state.coordinate.movableAreaPoints.lb) {
            this._movableArea = null
            return
        }

        const movableAreaPoints = [
            this._toDrawSize(store.state.coordinate.movableAreaPoints.lt),
            this._toDrawSize(store.state.coordinate.movableAreaPoints.rt),
            this._toDrawSize(store.state.coordinate.movableAreaPoints.rb),
            this._toDrawSize(store.state.coordinate.movableAreaPoints.lb)
        ]

        let path = ''
        movableAreaPoints.forEach((point, index) => {
            path += `${index === 0 ? 'M' : 'L'} ${-point.x} ${this._roomSize.drawY - point.y} `
        })
        path += 'Z'

        this._movableArea = new fabric.Path(path, {
            fill: '#888888',
            opacity: 0.3,
            evented: false
        })

        this._canvas.add(this._movableArea)
    }

    _generateAspectRatioPoints() {
        this._lightCurrentAspectRatio && this._canvas.remove(this._lightCurrentAspectRatio)

        if (!store.state.coordinate.aspectRatioPoints.lt || !store.state.coordinate.aspectRatioPoints.rt || !store.state.coordinate.aspectRatioPoints.rb || !store.state.coordinate.aspectRatioPoints.lb) {
            this._lightCurrentAspectRatio = null
            return
        }
        if (store.state.screen.currentAspectRatio === store.state.screen.aspectRatio) {
            this._lightCurrentAspectRatio = null
            return
        }

        const aspectRatioPoints = [
            this._toDrawSize(store.state.coordinate.aspectRatioPoints.lt),
            this._toDrawSize(store.state.coordinate.aspectRatioPoints.rt),
            this._toDrawSize(store.state.coordinate.aspectRatioPoints.rb),
            this._toDrawSize(store.state.coordinate.aspectRatioPoints.lb)
        ]

        let path = ''
        aspectRatioPoints.forEach((point, index) => {
            path += `${index === 0 ? 'M' : 'L'} ${-point.x} ${this._roomSize.drawY - point.y} `
        })
        path += 'Z'

        this._lightCurrentAspectRatio = new fabric.Path(path, {
            fill: 'rgb(151,237,246)',
            opacity: 1,
            evented: false
        })

        this._canvas.add(this._lightCurrentAspectRatio)
    }

    _generateObjects() {
        this._generateLightArea()
        this._generateDiagonal()
        // this._generateMountPlate()
        this._generateAxis()
        this._generateRuler()
        this._generateMovableArea()
        this._generateAspectRatioPoints()
        this._canvas.bringToFront(this._movableArea)
        this._canvas.bringToFront(this._light)
        this._canvas.bringToFront(this._lightCurrentAspectRatio)
        this._canvas.bringToFront(this._diagonal)
        this._canvas.bringToFront(this._mountPlate)
        this._canvas.bringToFront(this._projector)
        this._canvas.bringToFront(this._hAxis)
        this._canvas.bringToFront(this._vAxis)
        this._canvas.bringToFront(this._ustAxis)
        this._canvas.requestRenderAll()
    }

    renderCanvas(width, height) {
        width && (this._canvasWidth = width)
        height && (this._canvasHeight = height)
        this._canvas.setWidth(this._canvasWidth)
        this._canvas.setHeight(this._canvasHeight)

        this._initRoom()
        this._initProjector()
        this._setCanvasCenter()
        this._generateObjects()
    }
}
