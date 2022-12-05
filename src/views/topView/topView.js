import store from '../../store'
import bus from '../../helper/bus'
import { calcFromScreenMax, calcFromScreenMin, toFixedNumber } from '../../helper/common'
import Projector, { projectorRect } from './projector'
import ProjectorUST from './projectorUST'
import Showcase from '../components/showcase'
import BaseView from '../components/baseView'
import Shadow from '../components/shadow'
import Light from '../components/light'
import RulerH from '../components/ruler/rulerH'
import RulerV from '../components/ruler/rulerV'

const fabric = window.fabric

export default class TopView extends BaseView {
    constructor(domId) {
        super(domId)

        this._lightTop = null
        this._lightBottom = null
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
        this._projectorCenter.y = this._roomSize.drawY - store.state.projector.fromLeftside * this._roomSize.ratio

        this._setProjectorOffset()
        this._generateObjects()
    }

    _initRoom() {
        this._roomSize.x = store.state.room.depth
        this._roomSize.y = store.state.room.width
        this._generateRoom()
    }

    _initProjector() {
        if (this._projector) {
            this._canvas.remove(this._projector)
        }
        this._projector = store.state.projector.isUST ? this.ustModel._projector : new Projector()
        const _this = this
        this._projector.on({
            'moving'(e) {
                _this._movingProjector(e)
            },
            'selected'() {
                store.commit('common/SET_SELECTED_VIEW', 'TopView')
                bus.$emit('changeView', 'TopView')
            }
        })
        bus.$on('changeView', view => {
            if (view !== 'TopView') {
                _this._canvas.discardActiveObject()
                _this._canvas.requestRenderAll()
            }
        })

        this._canvas.add(this._projector)
    }

    _movingProjector(e) {
        this._projectorCenter.x = e.transform.target.left + (store.state.projector.isUST ? this.ustModel.xOffset : projectorRect.camera.x)
        if (this._projectorCenter.x <= this._projectorProp.fromScreenMinDraw) {
            this._projectorCenter.x = this._projectorProp.fromScreenMinDraw
        }
        if (this._projectorCenter.x >= this._projectorProp.fromScreenMaxDraw) {
            this._projectorCenter.x = this._projectorProp.fromScreenMaxDraw
        }
        this._projectorCenter.y = e.transform.target.top + (store.state.projector.isUST ? this.ustModel.yOffset : projectorRect.body.y / 2)
        if (this._projectorCenter.y <= 0) {
            this._projectorCenter.y = 0
        }
        if (this._projectorCenter.y >= this._roomSize.drawY) {
            this._projectorCenter.y = this._roomSize.drawY
        }
        this._dispatchPosition()
    }

    _dispatchPosition() {
        store.dispatch('projector/setFromScreen', toFixedNumber((this._projectorCenter.x / this._roomSize.ratio), 3))
        store.dispatch('projector/setFromLeftside', toFixedNumber(((this._roomSize.drawY - this._projectorCenter.y) / this._roomSize.ratio), 3))
        bus.$emit('setProjectorProp')
    }

    _setCanvasCenter() {
        this._setViewportTransform()
        this._setProjectorOffset()
    }

    _setProjectorOffset() {
        // const modelSize = projectorRectUST.body.x + projectorRectUST.camera.x / 2
        // const realDrawOffset = this._projectorCenter.x - modelSize
        // let xOffset = projectorRectUST.body.x + projectorRectUST.camera.x / 2
        // if (realDrawOffset < 2 * modelSize) {
        //     xOffset = (modelSize + realDrawOffset) / (3 * modelSize) * xOffset
        // }
        const angle = store.state.projector.angleH
        if (store.state.projector.isUST) {
            this._rotateObjectByPoint(this._projector, angle, this.ustModel.xOffset, this.ustModel.yOffset)
        } else {
            this._rotateObjectByPoint(this._projector, angle, projectorRect.camera.x, projectorRect.body.y / 2)
        }
    }

    _generateLightArea() {
        this._lightTop && this._canvas.remove(this._lightTop)
        this._lightBottom && this._canvas.remove(this._lightBottom)

        const hitPoints = store.state.coordinate.hitPoints
        const cutPoints = store.state.coordinate.cutPoints

        const pathArrayTop = [hitPoints.lt, ...cutPoints.top.left, ...cutPoints.top.front, ...cutPoints.top.right, hitPoints.rt]

        let path = `M ${this._projectorCenter.x} ${this._projectorCenter.y} `
        pathArrayTop.forEach(p => {
            const pDraw = this._toDrawSize(p)
            path += `L ${-pDraw.z} ${this._roomSize.drawY + pDraw.x}`
        })
        path += 'Z'

        this._lightTop = new Light(path)

        const pathArrayBottom = [hitPoints.rb, ...cutPoints.bottom.right, ...cutPoints.bottom.front, ...cutPoints.bottom.left, hitPoints.lb]

        path = `M ${this._projectorCenter.x} ${this._projectorCenter.y} `
        pathArrayBottom.forEach(p => {
            const pDraw = this._toDrawSize(p)
            path += `L ${-pDraw.z} ${this._roomSize.drawY + pDraw.x}`
        })
        path += 'Z'

        this._lightBottom = new Light(path)

        this._canvas.add(this._lightBottom)
        this._canvas.add(this._lightTop)
    }

    _generateShowcase() {
        this._showcases.forEach(showcase => this._canvas.remove(showcase))
        this._showcases = []

        const frontPoints = store.state.coordinate.frontPoints.map(point => this._toDrawSize(point))
        const leftPoints = store.state.coordinate.leftPoints.map(point => this._toDrawSize(point))
        const rightPoints = store.state.coordinate.rightPoints.map(point => this._toDrawSize(point))

        if (leftPoints.length > 0) {
            const sortByX = leftPoints.sort((a, b) => a.z - b.z)
            const x1 = -sortByX[0].z
            const x2 = -sortByX[sortByX.length - 1].z
            const showcase = new Showcase({ x: x1, y: this._roomSize.drawY }, { x: x2, y: this._roomSize.drawY })
            showcase.stroke = 'rgb(255,145,110)'
            this._showcases.push(showcase)
        }
        if (rightPoints.length > 0) {
            const sortByX = rightPoints.sort((a, b) => a.z - b.z)
            const x1 = -sortByX[0].z
            const x2 = -sortByX[sortByX.length - 1].z
            const showcase = new Showcase({ x: x1, y: 0 }, { x: x2, y: 0 })
            showcase.stroke = 'rgb(255,145,110)'
            this._showcases.push(showcase)
        }
        if (frontPoints.length > 0) {
            const sortByY = frontPoints.sort((a, b) => a.x - b.x)
            const y1 = this._roomSize.drawY + sortByY[0].x
            const y2 = this._roomSize.drawY + sortByY[sortByY.length - 1].x
            this._showcases.push(new Showcase({ x: store.state.screen.screenOffset * this._roomSize.ratio, y: y1 },
                { x: store.state.screen.screenOffset * this._roomSize.ratio, y: y2 }))
        }

        this._showcases.forEach(showcase => {
            if (store.state.screen.currentAspectRatio < store.state.screen.aspectRatio) {
                // showcase.stroke = '#aaaaaa'
            }
            this._canvas.add(showcase)
        })
    }

    _generateAspectRatioShowcase() {
        this._aspectRatioShowcase && this._canvas.remove(this._aspectRatioShowcase)

        if (store.state.screen.currentAspectRatio >= store.state.screen.aspectRatio) {
            this._aspectRatioShowcase = null
            return
        }

        const aspectRatioPoints = store.state.coordinate.aspectRatioPoints
        const arrayX = [-aspectRatioPoints.lt.x, -aspectRatioPoints.rt.x, -aspectRatioPoints.lb.x, -aspectRatioPoints.rb.x]

        let left = Math.min(...arrayX) * this._roomSize.ratio
        left < 0 && (left = 0)
        let right = Math.max(...arrayX) * this._roomSize.ratio
        right > this._roomSize.drawY && (right = this._roomSize.drawY)

        const y1 = this._roomSize.drawY - right
        const y2 = this._roomSize.drawY - left

        this._aspectRatioShowcase = new Showcase({ x: 0, y: y1 }, { x: 0, y: y2 })

        this._canvas.add(this._aspectRatioShowcase)
    }

    _generateShadow() {
        this._shadow && this._canvas.remove(this._shadow)

        const topPoints = store.state.coordinate.topPoints.map(point => this._toDrawSize(point))
        const bottomPoints = store.state.coordinate.bottomPoints.map(point => this._toDrawSize(point))
        let shadowPoint = []
        if (topPoints.length > 0) {
            shadowPoint = topPoints
        } else if (bottomPoints.length > 0) {
            shadowPoint = bottomPoints
        }
        if (shadowPoint.length > 0) {
            let path = `M ${-shadowPoint[0].z} ${this._roomSize.drawY + shadowPoint[0].x} `
            for (let i = 1; i < shadowPoint.length; i++) {
                path += `L ${-shadowPoint[i].z} ${this._roomSize.drawY + shadowPoint[i].x} `
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
        if (store.state.screen.currentAspectRatio < store.state.screen.aspectRatio) {
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
        if (store.state.screen.screenOffset > 0) {
            bottomMarks.push({ title: `${toFixedNumber(store.state.screen.screenOffset * store.state.common.unitRatio, 3)}`, length: store.state.screen.screenOffset * this._roomSize.ratio })
        }
        const isUST = store.state.projector.isUST
        const fromScreen = store.state.projector.fromScreen
        const sizeX = store.state.projector.size.x
        const x = isUST ? (fromScreen - sizeX) : fromScreen

        if (isUST) {
            this._projector.clipPath = new fabric.Rect({
                left: -this._projector.width / 2 + (this._ustAxis?.left - this._projector?.left),
                top: -this._projector.height / 2,
                width: this._projector.width,
                height: this._projector.height
            })
        }

        bottomMarks.push({ title: `${toFixedNumber((x - store.state.screen.screenOffset) * store.state.common.unitRatio, 3)}`, length: isUST ? x * this._roomSize.ratio : this._projectorCenter.x - store.state.screen.screenOffset * this._roomSize.ratio })
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
        this._canvas.bringToFront(this._lightBottom)
        this._canvas.bringToFront(this._lightTop)
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
