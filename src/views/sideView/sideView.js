import store from '../../store'
import bus from '../../helper/bus'
import { calcFromScreenMax, calcFromScreenMin, toFixedNumber } from '../../helper/common'

import BaseView from '../components/baseView'
import Projector, { projectorRect } from './projector'
import ProjectorUST from './projectorUST'
import Showcase from '../components/showcase'
import Shadow from '../components/shadow'
import Light from '../components/light'
import RulerH from '../components/ruler/rulerH'
import RulerV from '../components/ruler/rulerV'
import { installationType } from 'src/helper/enum'

const fabric = window.fabric

export default class SideView extends BaseView {
    constructor(domId) {
        super(domId)

        this._lightLeft = null
        this._lightRight = null
        this._showcases = []
        this._aspectRatioShowcase = null
        this._shadow = null
        this._availableRange = null
        this._isMoving = false

        this.ustModel = new ProjectorUST()
    }

    setProjectorProp() {
        this._projectorProp.fromScreenMax = Math.min(store.getters['projector/distance'].max + store.state.screen.screenOffset, calcFromScreenMax())
        this._projectorProp.fromScreenMaxDraw = this._projectorProp.fromScreenMax * this._roomSize.ratio
        this._projectorProp.fromScreenMin = calcFromScreenMin() + store.state.screen.screenOffset
        this._projectorProp.fromScreenMinDraw = this._projectorProp.fromScreenMin * this._roomSize.ratio

        this._projectorCenter.x = store.state.projector.fromScreen * this._roomSize.ratio
        this._projectorCenter.y = this._roomSize.drawY - store.state.projector.fromFloor * this._roomSize.ratio

        this._setProjectorOffset()
        this._generateObjects()
    }

    _initRoom() {
        this._roomSize.x = store.state.room.depth
        this._roomSize.y = store.state.room.height
        this._generateRoom()
    }

    _initProjector() {
        this._isInit = true

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
                store.commit('common/SET_SELECTED_VIEW', 'SideView')
                bus.$emit('changeView', 'SideView')
            }
        })
        bus.$on('changeView', view => {
            if (view !== 'SideView') {
                _this._canvas.discardActiveObject()
                _this._canvas.requestRenderAll()
            }
        })
        this._canvas.add(this._projector)

        this._isInit = false
    }

    _movingProjector(e) {
        this._projectorCenter.x = e.transform.target.left + (store.state.projector.isUST ? 12 : projectorRect.camera.x)
        if (this._projectorCenter.x >= this._projectorProp.fromScreenMaxDraw) {
            this._projectorCenter.x = this._projectorProp.fromScreenMaxDraw
        }
        if (this._projectorCenter.x <= this._projectorProp.fromScreenMinDraw) {
            this._projectorCenter.x = this._projectorProp.fromScreenMinDraw
        }

        this._projectorCenter.y = e.transform.target.top + projectorRect.body.y / 2
        if (this._projectorCenter.y >= this._roomSize.drawY) {
            this._projectorCenter.y = this._roomSize.drawY
        }
        if (this._projectorCenter.y <= 0) {
            this._projectorCenter.y = 0
        }
        this._dispatchPosition()
    }

    _dispatchPosition() {
        store.dispatch('projector/setFromScreen', toFixedNumber((this._projectorCenter.x / this._roomSize.ratio), 3))
        store.dispatch('projector/setFromFloor', toFixedNumber(((this._roomSize.drawY - this._projectorCenter.y) / this._roomSize.ratio), 3))
        bus.$emit('setProjectorProp')
    }

    _setCanvasCenter() {
        this._setViewportTransform()
        this._setProjectorOffset()
    }

    _setProjectorOffset() {
        const angle = store.state.projector.angleV
        if (store.state.projector.isUST) {
            const isReverse = store.state.common.installation === installationType.ceiling
            !isReverse && this._rotateObjectByPoint(this._projector, angle, 12, 8)
            isReverse && this._rotateObjectByPoint(this._projector, angle, 12, 20)
        } else {
            this._rotateObjectByPoint(this._projector, angle, projectorRect.camera.x, projectorRect.body.y / 2)
        }
    }

    _generateLightArea() {
        this._lightLeft && this._canvas.remove(this._lightLeft)
        this._lightRight && this._canvas.remove(this._lightRight)

        const hitPoints = store.state.coordinate.hitPoints
        const cutPoints = store.state.coordinate.cutPoints

        const pathArrayLeft = [hitPoints.lb, ...cutPoints.left.bottom, ...cutPoints.left.front, ...cutPoints.left.top, hitPoints.lt]

        let path = `M ${this._projectorCenter.x} ${this._projectorCenter.y} `
        pathArrayLeft.forEach(p => {
            const pDraw = this._toDrawSize(p)
            path += `L ${-pDraw.z} ${this._roomSize.drawY - pDraw.y}`
        })
        path += 'Z'

        this._lightLeft = new Light(path)

        const pathArrayRight = [hitPoints.rt, ...cutPoints.right.top, ...cutPoints.right.front, ...cutPoints.right.bottom, hitPoints.rb]

        path = `M ${this._projectorCenter.x} ${this._projectorCenter.y} `
        pathArrayRight.forEach(p => {
            const pDraw = this._toDrawSize(p)
            path += `L ${-pDraw.z} ${this._roomSize.drawY - pDraw.y}`
        })
        path += 'Z'

        this._lightRight = new Light(path)

        this._canvas.add(this._lightRight)
        this._canvas.add(this._lightLeft)
    }

    _generateShowcase() {
        this._showcases.forEach(showcase => this._canvas.remove(showcase))
        this._showcases = []

        const frontPoints = store.state.coordinate.frontPoints.map(point => this._toDrawSize(point))
        const topPoints = store.state.coordinate.topPoints.map(point => this._toDrawSize(point))
        const bottomPoints = store.state.coordinate.bottomPoints.map(point => this._toDrawSize(point))

        if (topPoints.length > 0) {
            const sortByX = topPoints.sort((a, b) => a.z - b.z)
            const x1 = -sortByX[0].z
            const x2 = -sortByX[sortByX.length - 1].z
            const showcase = new Showcase({ x: x1, y: 0 }, { x: x2, y: 0 })
            showcase.stroke = 'rgb(255,145,110)'
            this._showcases.push(showcase)
        }
        if (bottomPoints.length > 0) {
            const sortByX = bottomPoints.sort((a, b) => a.z - b.z)
            const x1 = -sortByX[0].z
            const x2 = -sortByX[sortByX.length - 1].z
            const showcase = new Showcase({ x: x1, y: this._roomSize.drawY }, { x: x2, y: this._roomSize.drawY })
            showcase.stroke = 'rgb(255,145,110)'
            this._showcases.push(showcase)
        }
        if (frontPoints.length > 0) {
            const sortByY = frontPoints.sort((a, b) => a.y - b.y)
            const y1 = this._roomSize.drawY - sortByY[sortByY.length - 1].y
            const y2 = this._roomSize.drawY - sortByY[0].y
            const showcase = new Showcase({ x: 0, y: y1 }, { x: 0, y: y2 })
            this._showcases.push(showcase)
        }

        this._showcases.forEach(showcase => {
            if (store.state.screen.currentAspectRatio > store.state.screen.aspectRatio) {
                // showcase.stroke = '#aaaaaa'
            }
            this._canvas.add(showcase)
        })
    }

    _generateAspectRatioShowcase() {
        this._aspectRatioShowcase && this._canvas.remove(this._aspectRatioShowcase)

        if (store.state.screen.currentAspectRatio <= store.state.screen.aspectRatio) {
            this._aspectRatioShowcase = null
            return
        }

        const aspectRatioPoints = store.state.coordinate.aspectRatioPoints
        const arrayY = [aspectRatioPoints.lt.y, aspectRatioPoints.rt.y, aspectRatioPoints.lb.y, aspectRatioPoints.rb.y]

        let top = Math.max(...arrayY) * this._roomSize.ratio
        top > this._roomSize.drawY && (top = this._roomSize.drawY)
        let bottom = Math.min(...arrayY) * this._roomSize.ratio
        bottom < 0 && (bottom = 0)

        const y1 = this._roomSize.drawY - top
        const y2 = this._roomSize.drawY - bottom

        this._aspectRatioShowcase = new Showcase({ x: 0, y: y1 }, { x: 0, y: y2 })

        this._canvas.add(this._aspectRatioShowcase)
    }

    _generateShadow() {
        this._shadow && this._canvas.remove(this._shadow)

        const leftPoints = store.state.coordinate.leftPoints.map(point => this._toDrawSize(point))
        const rightPoints = store.state.coordinate.rightPoints.map(point => this._toDrawSize(point))
        let shadowPoint = []
        if (leftPoints.length > 0) {
            shadowPoint = leftPoints
        } else if (rightPoints.length > 0) {
            shadowPoint = rightPoints
        }
        if (shadowPoint.length > 0) {
            let path = `M ${-shadowPoint[0].z} ${this._roomSize.drawY - shadowPoint[0].y} `
            for (let i = 1; i < shadowPoint.length; i++) {
                path += `L ${-shadowPoint[i].z} ${this._roomSize.drawY - shadowPoint[i].y} `
            }
            path += 'Z'
            this._shadow = new Shadow(path)
            this._canvas.add(this._shadow)
        } else {
            this._shadow = null
        }
    }

    _generateAvailableRange() {
        if (!this._availableRange) {
            this._availableRange = new fabric.Rect({
                fill: '#888888',
                opacity: 0.2,
                evented: false
            })
            this._canvas.add(this._availableRange)
        }

        const fromScreen = (this._projectorCenter.x - store.state.screen.screenOffset)
        let widthMin = fromScreen / store.state.projector.throwRatioMin
        let left = this._projectorCenter.x
        let right = widthMin * store.state.projector.throwRatioMax

        if (store.state.screen.lockScreenSize) {
            widthMin = store.state.screen.width
            left = widthMin * store.state.projector.throwRatioMin * this._roomSize.ratio
            right = widthMin * store.state.projector.throwRatioMax * this._roomSize.ratio
        }

        this._availableRange.setOptions({
            top: 0,
            left: left,
            width: right - left,
            height: this._roomSize.drawY
        })
    }

    _generateRuler() {
        if (!this._showcases.length) {
            return
        }

        this._generateRulerTop()
        this._generateRulerRight()

        const leftMarks = []
        let leftLine = this._showcases[0]
        if (store.state.screen.currentAspectRatio > store.state.screen.aspectRatio) {
            leftLine = this._aspectRatioShowcase
        }
        if (leftLine.y1 > 0) {
            leftMarks.push({ title: `${toFixedNumber(leftLine.y1 / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: leftLine.y1 })
        }
        leftMarks.push({ title: `${toFixedNumber((leftLine.y2 - leftLine.y1) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: leftLine.y2 - leftLine.y1 })
        if (leftLine.y2 < this._roomSize.drawY) {
            leftMarks.push({ title: `${toFixedNumber((this._roomSize.drawY - leftLine.y2) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: this._roomSize.drawY - leftLine.y2 })
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
                    o.left = this._rulerLeft.getLeftMarkOffset(optionsLeft.marks) + 10
                }
            })
        } else {
            this._rulerLeft = new RulerV(optionsLeft)
            const objects = this._rulerLeft.getObjects()
            objects.forEach(o => {
                if (o.type === 'text') {
                    o.left += this._rulerLeft.getLeftMarkOffset(optionsLeft.marks) + 10
                } else {
                    o.left -= 10
                }
                this._canvas.add(o)
            })
        }

        const bottomMarks = []
        if (store.state.screen.screenOffset > 0) {
            bottomMarks.push({ title: `${toFixedNumber(store.state.screen.screenOffset * store.state.common.unitRatio, 3)}`, length: store.state.screen.screenOffset * this._roomSize.ratio })
        }
        const isUST = store.state.projector.isUST
        const fromScreen = store.state.projector.fromScreen
        const sizeX = store.state.projector.size.x
        const x = isUST ? (fromScreen - sizeX) : fromScreen
        bottomMarks.push({ title: `${toFixedNumber((x - store.state.screen.screenOffset) * store.state.common.unitRatio, 3)}`, length: isUST ? this._projector.left : this._projectorCenter.x - store.state.screen.screenOffset * this._roomSize.ratio })
        if (this._availableRange.width > 0 && this._availableRange.left + this._availableRange.width < this._roomSize.drawX) {
            bottomMarks.push({ title: `${toFixedNumber(this._availableRange.width / this._roomSize.ratio * store.state.common.unitRatio, 3)}`, length: this._availableRange.width })
            bottomMarks.push({
                title: `${toFixedNumber((this._roomSize.drawX - x * this._roomSize.ratio - this._availableRange.width) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`,
                length: this._roomSize.drawX - this._availableRange.left - this._availableRange.width
            })
        } else {
            bottomMarks.push({
                title: `${toFixedNumber((this._roomSize.drawX - this._projectorCenter.x) / this._roomSize.ratio * store.state.common.unitRatio, 3)}`,
                length: this._roomSize.drawX - this._projectorCenter.x
            })
        }

        const optionsBottom = {
            length: this._roomSize.drawX,
            marks: bottomMarks
        }
        if (this._rulerBottom) {
            this._rulerBottom.setOptions(optionsBottom)
        } else {
            this._rulerBottom = new RulerH(optionsBottom)
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

    _generateObjects() {
        this._generateLightArea()
        this._generateShowcase()
        this._generateAspectRatioShowcase()
        this._generateShadow()
        this._generateAvailableRange()
        this._generateAxis(store.state.projector.isUST)
        this._generateRuler()
        this._canvas.bringToFront(this._availableRange)
        this._canvas.bringToFront(this._projector)
        this._canvas.bringToFront(this._shadow)
        this._showcases.forEach(showcase => { this._canvas.bringToFront(showcase) })
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
