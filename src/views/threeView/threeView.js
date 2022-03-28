import {
    Mesh,
    BufferGeometry, ShapeGeometry,
    Vector3, Line, Ray, Shape, Color
} from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

import store from '../../store'
import bus from '../../helper/bus'
import { toFixedNumber } from '../../helper/common'

import ThreeBase from './threeBase'
import { extend, Dark } from 'quasar'
import { installationType } from 'src/helper/enum'
import { calcFromScreenMax, calcFromScreenMin } from 'src/helper/common'

export default class ThreeView extends ThreeBase {
    constructor(domSelector) {
        super()

        this._init(domSelector)
    }

    setProjectorProp() {
        if (!this._projector) {
            return
        }

        if (store.state.screen.lockScreenSize) { // 锁定屏幕尺寸，只改变throw ratio
            store.commit('projector/SET_THROW_RATIO', store.state.projector.fromScreen / store.state.screen.width)
        }

        const fixTanV = 1 / store.state.projector.throwRatio / store.state.screen.aspectRatio / 2
        const lenShiftTopRatio = store.state.common.installation === installationType.desktop
            ? (1 + (store.state.lens.lensShiftV * 2 + store.state.lens.offset) / 100)
            : (1 - (store.state.lens.lensShiftV * 2 + store.state.lens.offset) / 100)
        this._fixedAngleTop = Math.atan(fixTanV * lenShiftTopRatio) * 180 / Math.PI
        const lenShiftBottomRatio = store.state.common.installation === installationType.desktop
            ? (1 - (store.state.lens.lensShiftV * 2 + store.state.lens.offset) / 100)
            : (1 + (store.state.lens.lensShiftV * 2 + store.state.lens.offset) / 100)
        this._fixedAngleBottom = Math.atan(fixTanV * lenShiftBottomRatio) * 180 / Math.PI

        const fixTanH = 1 / store.state.projector.throwRatio / 2
        const lenShiftLeftRatio = 1 + store.state.lens.lensShiftH * 2 / 100
        this._fixedAngleRight = Math.atan(fixTanH * lenShiftLeftRatio) * 180 / Math.PI
        const lenShiftRightRatio = 1 - store.state.lens.lensShiftH * 2 / 100
        this._fixedAngleLeft = Math.atan(fixTanH * lenShiftRightRatio) * 180 / Math.PI

        this._angleH = store.state.projector.angleH
        this._angleV = store.state.projector.angleV

        const lenShiftVRatioMax = store.state.common.installation === installationType.desktop
            ? (1 + (store.state.lens.maxLensShiftV * 2 + store.state.lens.offset) / 100)
            : (1 - (store.state.lens.minLensShiftV * 2 + store.state.lens.offset) / 100)
        this._maxFixedAngleV = Math.atan(fixTanV * lenShiftVRatioMax) * 180 / Math.PI
        const lenShiftVRatioMin = store.state.common.installation === installationType.desktop
            ? (1 - (store.state.lens.minLensShiftV * 2 + store.state.lens.offset) / 100)
            : (1 + (store.state.lens.maxLensShiftV * 2 + store.state.lens.offset) / 100)
        this._minFixedAngleV = Math.atan(fixTanV * lenShiftVRatioMin) * 180 / Math.PI
        const lenShiftHRatioMax = 1 + store.state.lens.maxLensShiftH * 2 / 100
        this._maxFixedAngleH = Math.atan(fixTanH * lenShiftHRatioMax) * 180 / Math.PI
        const lenShiftHRatioMin = 1 - store.state.lens.minLensShiftH * 2 / 100
        this._minFixedAngleH = Math.atan(fixTanH * lenShiftHRatioMin) * 180 / Math.PI

        const aspectRatio = store.state.screen.aspectRatio
        const currentAspectRatio = store.state.screen.currentAspectRatio
        if (currentAspectRatio > aspectRatio) {
            const aspectRatioFix = (1 - aspectRatio / currentAspectRatio) * 100
            const aspectRatioTop = store.state.common.installation === installationType.desktop
                ? (1 + (store.state.lens.offset - aspectRatioFix) / 100)
                : (1 - (store.state.lens.offset + aspectRatioFix) / 100)
            this._aspectAngleTop = Math.atan(fixTanV * aspectRatioTop) * 180 / Math.PI
            const aspectRatioBottom = store.state.common.installation === installationType.desktop
                ? (1 - (store.state.lens.offset + aspectRatioFix) / 100)
                : (1 + (store.state.lens.offset - aspectRatioFix) / 100)
            this._aspectAngleBottom = Math.atan(fixTanV * aspectRatioBottom) * 180 / Math.PI
            this._aspectAngleLeft = Math.atan(fixTanH) * 180 / Math.PI
            this._aspectAngleRight = Math.atan(fixTanH) * 180 / Math.PI
        }
        if (currentAspectRatio < aspectRatio) {
            const aspectRatioFix = (1 - currentAspectRatio / aspectRatio) * 100
            const aspectRatioTop = store.state.common.installation === installationType.desktop
                ? (1 + store.state.lens.offset / 100)
                : (1 - store.state.lens.offset / 100)
            this._aspectAngleTop = Math.atan(fixTanV * aspectRatioTop) * 180 / Math.PI
            const aspectRatioBottom = store.state.common.installation === installationType.desktop
                ? (1 - store.state.lens.offset / 100)
                : (1 + store.state.lens.offset / 100)
            this._aspectAngleBottom = Math.atan(fixTanV * aspectRatioBottom) * 180 / Math.PI
            const aspectRatioLeft = 1 - aspectRatioFix / 100
            this._aspectAngleLeft = Math.atan(fixTanH * aspectRatioLeft) * 180 / Math.PI
            const aspectRatioRight = 1 - aspectRatioFix / 100
            this._aspectAngleRight = Math.atan(fixTanH * aspectRatioRight) * 180 / Math.PI
        }

        this._projector.position.x = -(store.state.projector.fromLeftside * this._roomSize.ratio)
        this._projector.position.y = store.state.projector.fromFloor * this._roomSize.ratio
        this._projector.position.z = -(store.state.projector.fromScreen * this._roomSize.ratio)

        this._projector.rotation.x = -this._angleV * Math.PI / 180
        this._projector.rotation.y = -this._angleH * Math.PI / 180

        this._initProjectorLight()
    }

    resizeRoom() {
        this._initRoom()
        this.setProjectorProp()
    }

    setTheme() {
        this._scene.background = Dark.isActive ? new Color(0x131417) : new Color(0xffffff)
    }

    _init(domSelector) {
        this._initRenderer(domSelector)
        this._initScene()
        this._initControls()
        this._initTransformControl()
        this._initRoom()
        this._initProjector()
        this.setTheme()
    }

    _initProjector() {
        const mtlLoader = new MTLLoader()
        const objLoader = new OBJLoader()
        mtlLoader.load('models/H7T_Laset7.mtl', materials => {
            objLoader.setMaterials(materials)
            objLoader.load('models/H7T_Laset7.obj', objects => { // 这个地方加载比较慢，所以在此触发默认值的设置
                objects.children.forEach(object => {
                    object.geometry.computeBoundingBox()
                    object.geometry.center()
                })
                objects.rotation.y = -90 * Math.PI / 180
                this._scene.add(objects)
                this._transformControl.attach(objects)
                this._projector = objects
                this._setProjectorDefault()
                this._setProjectorCenter()
                this._dispatchPosition()
                bus.$emit('setDefaultDiagonal')
                this._transformControl.addEventListener('change', () => {
                    this._fromScreenMax = Math.min(calcFromScreenMax(), store.getters['projector/distance'].max + store.state.screen.screenOffset) * this._roomSize.ratio
                    this._fromScreenMin = (calcFromScreenMin() + store.state.screen.screenOffset) * this._roomSize.ratio
                    if (this._projector.position.x > 0) {
                        this._projector.position.x = 0
                    } else if (this._projector.position.x < -this._roomSize.widthDraw) {
                        this._projector.position.x = -this._roomSize.widthDraw
                    }
                    if (this._projector.position.y < 0) {
                        this._projector.position.y = 0
                    } else if (this._projector.position.y > this._roomSize.heightDraw) {
                        this._projector.position.y = this._roomSize.heightDraw
                    }
                    if (this._projector.position.z > -this._fromScreenMin) {
                        this._projector.position.z = -this._fromScreenMin
                    }
                    if (this._projector.position.z < -this._fromScreenMax) {
                        this._projector.position.z = -this._fromScreenMax
                    }
                    this._setProjectorCenter()
                    this._dispatchPosition()
                })
            })
        })
    }

    _dispatchPosition() {
        store.dispatch('projector/setFromScreen', toFixedNumber((-this._projectorCenter.z / this._roomSize.ratio), 3))
        store.dispatch('projector/setFromLeftside', toFixedNumber((-this._projectorCenter.x / this._roomSize.ratio), 3))
        store.dispatch('projector/setFromFloor', toFixedNumber((this._projectorCenter.y / this._roomSize.ratio), 3))
        bus.$emit('setProjectorProp')
    }

    _setProjectorDefault() {
        this._projector.position.x = -this._roomSize.widthDraw / 2
        this._projector.position.y = this._roomSize.heightDraw / 2
        this._projector.position.z = -this._fromScreenMax / 2
    }

    _setProjectorCenter() {
        this._projectorCenter.x = this._projector.position.x
        this._projectorCenter.y = this._projector.position.y
        this._projectorCenter.z = this._projector.position.z
    }

    _initProjectorLight() {
        try {
            this._setProjectorCenter()
            this._calcHitPoints()
            this._calcPlanePoints()
            this._generateLightBound()
            this._generateShowcase()
        } catch (e) {
            console.error(e)
        }
    }

    _generateShowcase() {
        Object.values(this._showcase.geometrys).forEach(geometry => {
            geometry && geometry.dispose()
        })
        Object.values(this._showcase.objects).forEach(object => {
            object && this._scene.remove(object)
        })

        if (this._planePoints.left.length > 2) {
            const leftShowcase = new Shape()
            leftShowcase.moveTo(-this._planePoints.left[0].z, this._planePoints.left[0].y)
            for (let i = 1; i < this._planePoints.left.length; i++) {
                leftShowcase.lineTo(-this._planePoints.left[i].z, this._planePoints.left[i].y)
            }
            leftShowcase.closePath()
            this._showcase.geometrys.left = new ShapeGeometry(leftShowcase)
            this._showcase.objects.left = new Mesh(this._showcase.geometrys.left, this._showcase.materialOpacity)
            this._showcase.objects.left.rotateY(0.5 * Math.PI)
            this._scene.add(this._showcase.objects.left)
        }

        if (this._planePoints.right.length > 2) {
            const rightShowcase = new Shape()
            rightShowcase.moveTo(-this._planePoints.right[0].z, this._planePoints.right[0].y)
            for (let i = 1; i < this._planePoints.right.length; i++) {
                rightShowcase.lineTo(-this._planePoints.right[i].z, this._planePoints.right[i].y)
            }
            rightShowcase.closePath()
            this._showcase.geometrys.right = new ShapeGeometry(rightShowcase)
            this._showcase.objects.right = new Mesh(this._showcase.geometrys.right, this._showcase.material)
            this._showcase.objects.right.rotateY(0.5 * Math.PI)
            this._showcase.objects.right.position.x = -this._roomSize.widthDraw
            this._scene.add(this._showcase.objects.right)
        }

        if (this._planePoints.bottom.length > 2) {
            const bottomShowcase = new Shape()
            bottomShowcase.moveTo(this._planePoints.bottom[0].x, this._planePoints.bottom[0].z)
            for (let i = 1; i < this._planePoints.bottom.length; i++) {
                bottomShowcase.lineTo(this._planePoints.bottom[i].x, this._planePoints.bottom[i].z)
            }
            bottomShowcase.closePath()
            this._showcase.geometrys.bottom = new ShapeGeometry(bottomShowcase)
            this._showcase.objects.bottom = new Mesh(this._showcase.geometrys.bottom, this._showcase.material)
            this._showcase.objects.bottom.rotateX(0.5 * Math.PI)
            this._showcase.objects.bottom.position.y = 0
            this._scene.add(this._showcase.objects.bottom)
        }

        if (this._planePoints.top.length > 2) {
            const topShowcase = new Shape()
            topShowcase.moveTo(this._planePoints.top[0].x, this._planePoints.top[0].z)
            for (let i = 1; i < this._planePoints.top.length; i++) {
                topShowcase.lineTo(this._planePoints.top[i].x, this._planePoints.top[i].z)
            }
            topShowcase.closePath()
            this._showcase.geometrys.top = new ShapeGeometry(topShowcase)
            this._showcase.objects.top = new Mesh(this._showcase.geometrys.top, this._showcase.materialOpacity)
            this._showcase.objects.top.rotateX(0.5 * Math.PI)
            this._showcase.objects.top.position.y = this._roomSize.heightDraw
            this._scene.add(this._showcase.objects.top)
        }

        if (this._planePoints.front.length > 2) {
            const frontShowcase = new Shape()
            frontShowcase.moveTo(this._planePoints.front[0].x, this._planePoints.front[0].y)
            for (let i = 1; i < this._planePoints.front.length; i++) {
                frontShowcase.lineTo(this._planePoints.front[i].x, this._planePoints.front[i].y)
            }
            frontShowcase.closePath()
            this._showcase.geometrys.front = new ShapeGeometry(frontShowcase)
            this._showcase.objects.front = new Mesh(this._showcase.geometrys.front, this._showcase.material)
            this._showcase.objects.front.position.z = this._screenOffset
            this._scene.add(this._showcase.objects.front)
        }
    }

    _calcLeftPoints() {
        const pointInLeft = []
        for (const position in this._hitPoints) {
            const point = this._hitPoints[position]
            if (point.x === 0) {
                pointInLeft.push({ position: position, point: point })
            }
        }
        const pointLt = pointInLeft.find(o => o.position === 'lt')?.point
        const pointRt = pointInLeft.find(o => o.position === 'rt')?.point
        const pointLb = pointInLeft.find(o => o.position === 'lb')?.point
        const pointRb = pointInLeft.find(o => o.position === 'rb')?.point

        const cornorLt = this._isCornorLighted('lt') ? new Vector3(0, this._roomSize.heightDraw, this._screenOffset) : undefined
        const cornorLb = this._isCornorLighted('lb') ? new Vector3(0, 0, this._screenOffset) : undefined

        const points = [
            pointLb, ...this._cutPoints.left.left,
            pointLt, ...this._cutPoints.top.left,
            pointRt, cornorLt, ...this._cutPoints.right.left,
            pointRb, cornorLb, ...this._cutPoints.bottom.left
        ]

        this._planePoints.left = points.filter(point => point !== undefined)
    }

    _calcRightPoints() {
        const pointInRight = []
        for (const position in this._hitPoints) {
            const point = this._hitPoints[position]
            if (point.x === -this._roomSize.widthDraw) {
                pointInRight.push({ position: position, point: point })
            }
        }
        const pointLt = pointInRight.find(o => o.position === 'lt')?.point
        const pointRt = pointInRight.find(o => o.position === 'rt')?.point
        const pointLb = pointInRight.find(o => o.position === 'lb')?.point
        const pointRb = pointInRight.find(o => o.position === 'rb')?.point

        const cornorRt = this._isCornorLighted('rt') ? new Vector3(-this._roomSize.widthDraw, this._roomSize.heightDraw, this._screenOffset) : undefined
        const cornorRb = this._isCornorLighted('rb') ? new Vector3(-this._roomSize.widthDraw, 0, this._screenOffset) : undefined

        const points = [
            pointLb, cornorRb, ...this._cutPoints.left.right,
            pointLt, cornorRt, ...this._cutPoints.top.right,
            pointRt, ...this._cutPoints.right.right,
            pointRb, ...this._cutPoints.bottom.right
        ]

        this._planePoints.right = points.filter(point => point !== undefined)
    }

    _calcBottomPoints() {
        const pointInBottom = []
        for (const position in this._hitPoints) {
            const point = this._hitPoints[position]
            if (point.y === 0) {
                pointInBottom.push({ position: position, point: point })
            }
        }

        const pointLt = pointInBottom.find(o => o.position === 'lt')?.point
        const pointRt = pointInBottom.find(o => o.position === 'rt')?.point
        const pointLb = pointInBottom.find(o => o.position === 'lb')?.point
        const pointRb = pointInBottom.find(o => o.position === 'rb')?.point

        const cornorLb = this._isCornorLighted('lb') ? new Vector3(0, 0, this._screenOffset) : undefined
        const cornorRb = this._isCornorLighted('rb') ? new Vector3(-this._roomSize.widthDraw, 0, this._screenOffset) : undefined

        const points = [
            pointLb, ...this._cutPoints.left.bottom,
            pointLt, cornorLb, ...this._cutPoints.top.bottom,
            pointRt, cornorRb, ...this._cutPoints.right.bottom,
            pointRb, ...this._cutPoints.bottom.bottom
        ]

        this._planePoints.bottom = points.filter(point => point !== undefined)
    }

    _calcTopPoints() {
        const pointInTop = []
        for (const position in this._hitPoints) {
            const point = this._hitPoints[position]
            if (point.y === this._roomSize.heightDraw) {
                pointInTop.push({ position: position, point: point })
            }
        }

        const pointLt = pointInTop.find(o => o.position === 'lt')?.point
        const pointRt = pointInTop.find(o => o.position === 'rt')?.point
        const pointLb = pointInTop.find(o => o.position === 'lb')?.point
        const pointRb = pointInTop.find(o => o.position === 'rb')?.point

        const cornorLt = this._isCornorLighted('lt') ? new Vector3(0, this._roomSize.heightDraw, this._screenOffset) : undefined
        const cornorRt = this._isCornorLighted('rt') ? new Vector3(-this._roomSize.widthDraw, this._roomSize.heightDraw, this._screenOffset) : undefined

        const points = [
            pointLb, cornorLt, ...this._cutPoints.left.top,
            pointLt, ...this._cutPoints.top.top,
            pointRt, ...this._cutPoints.right.top,
            pointRb, cornorRt, ...this._cutPoints.bottom.top
        ]

        this._planePoints.top = points.filter(point => point !== undefined)
    }

    _calcFrontPoints() {
        const pointInFront = []
        for (const position in this._hitPoints) {
            const point = this._hitPoints[position]
            if (point.z === this._screenOffset) {
                pointInFront.push({ position: position, point: point })
            }
        }

        const pointLt = pointInFront.find(o => o.position === 'lt')?.point
        const pointRt = pointInFront.find(o => o.position === 'rt')?.point
        const pointLb = pointInFront.find(o => o.position === 'lb')?.point
        const pointRb = pointInFront.find(o => o.position === 'rb')?.point

        const cornorLt = this._isCornorLighted('lt') ? new Vector3(0, this._roomSize.heightDraw, this._screenOffset) : undefined
        const cornorRt = this._isCornorLighted('rt') ? new Vector3(-this._roomSize.widthDraw, this._roomSize.heightDraw, this._screenOffset) : undefined
        const cornorLb = this._isCornorLighted('lb') ? new Vector3(0, 0, this._screenOffset) : undefined
        const cornorRb = this._isCornorLighted('rb') ? new Vector3(-this._roomSize.widthDraw, 0, this._screenOffset) : undefined

        const points = [
            pointLb, cornorLb, ...this._cutPoints.left.front,
            pointLt, cornorLt, ...this._cutPoints.top.front,
            pointRt, cornorRt, ...this._cutPoints.right.front,
            pointRb, cornorRb, ...this._cutPoints.bottom.front
        ]

        this._planePoints.front = points.filter(point => point !== undefined)
    }

    _calcLeftBoundConnorPoints() {
        const hitPoints = []

        const offset = (this._directionOringin.lt.y - this._directionOringin.lb.y) / this.cutDivide
        let lastPoint, lastY
        for (let i = 0; i <= this.cutDivide + 1; i++) { // +1  是因为考虑精度原因，边缘可能无法处理
            const direction = this._directionOringin.lb.clone()
            direction.y += offset * i
            direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
            direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
            const point = this._calcHitPoint(this._projectorCenter, direction)
            if (lastPoint && this._isInDifferentPlane(lastPoint, point)) {
                const offsetSub = offset / this.subDivide
                for (let j = 0; j <= this.subDivide; j++) {
                    const directionSub = this._directionOringin.lb.clone()
                    directionSub.y = lastY + offsetSub * j
                    directionSub.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
                    directionSub.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
                    const point = this._calcHitPoint(this._projectorCenter, directionSub)
                    point.x = toFixedNumber(point.x, 1)
                    point.y = toFixedNumber(point.y, 1)
                    point.z = toFixedNumber(point.z, 1)
                    if (this._isOnEdge(point)) {
                        hitPoints.push(point)
                        break
                    }
                }
            }
            lastPoint = point
            lastY = this._directionOringin.lb.y + offset * i
        }

        const leftPoints = hitPoints.filter(point => point.x === 0)
        const rightPoints = hitPoints.filter(point => point.x === -this._roomSize.widthDraw)
        const topPoints = hitPoints.filter(point => point.y === this._roomSize.heightDraw)
        const bottomPoints = hitPoints.filter(point => point.y === 0)
        const frontPoints = hitPoints.filter(point => point.z === toFixedNumber(this._screenOffset, 1))

        this._cutPoints.left.left = leftPoints
        this._cutPoints.left.right = rightPoints
        this._cutPoints.left.top = topPoints
        this._cutPoints.left.bottom = bottomPoints
        this._cutPoints.left.front = frontPoints
    }

    _calcRightBoundConnorPoints() {
        const hitPoints = []

        const offset = (this._directionOringin.rb.y - this._directionOringin.rt.y) / this.cutDivide
        let lastPoint, lastY
        for (let i = 0; i <= this.cutDivide + 1; i++) {
            const direction = this._directionOringin.rt.clone()
            direction.y += offset * i
            direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
            direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
            const point = this._calcHitPoint(this._projectorCenter, direction)
            if (lastPoint && this._isInDifferentPlane(lastPoint, point)) {
                const offsetSub = offset / this.subDivide
                for (let j = 0; j <= this.subDivide; j++) {
                    const directionSub = this._directionOringin.rt.clone()
                    directionSub.y = lastY + offsetSub * j
                    directionSub.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
                    directionSub.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
                    const point = this._calcHitPoint(this._projectorCenter, directionSub)
                    point.x = toFixedNumber(point.x, 1)
                    point.y = toFixedNumber(point.y, 1)
                    point.z = toFixedNumber(point.z, 1)
                    if (this._isOnEdge(point)) {
                        hitPoints.push(point)
                        break
                    }
                }
            }
            lastPoint = point
            lastY = this._directionOringin.rt.y + offset * i
        }

        const leftPoints = hitPoints.filter(point => point.x === 0)
        const rightPoints = hitPoints.filter(point => point.x === -this._roomSize.widthDraw)
        const topPoints = hitPoints.filter(point => point.y === this._roomSize.heightDraw)
        const bottomPoints = hitPoints.filter(point => point.y === 0)
        const frontPoints = hitPoints.filter(point => point.z === toFixedNumber(this._screenOffset, 1))

        this._cutPoints.right.left = leftPoints
        this._cutPoints.right.right = rightPoints
        this._cutPoints.right.top = topPoints
        this._cutPoints.right.bottom = bottomPoints
        this._cutPoints.right.front = frontPoints
    }

    _calcTopBoundConnorPoints() {
        const hitPoints = []

        const offset = (this._directionOringin.rt.x - this._directionOringin.lt.x) / this.cutDivide
        let lastPoint, lastX
        for (let i = 0; i <= this.cutDivide + 1; i++) {
            const direction = this._directionOringin.lt.clone()
            direction.x += offset * i
            direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
            direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
            const point = this._calcHitPoint(this._projectorCenter, direction)
            if (lastPoint && this._isInDifferentPlane(lastPoint, point)) {
                const offsetSub = offset / this.subDivide
                for (let j = 0; j <= this.subDivide; j++) {
                    const directionSub = this._directionOringin.lt.clone()
                    directionSub.x = lastX + offsetSub * j
                    directionSub.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
                    directionSub.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
                    const point = this._calcHitPoint(this._projectorCenter, directionSub)
                    point.x = toFixedNumber(point.x, 1)
                    point.y = toFixedNumber(point.y, 1)
                    point.z = toFixedNumber(point.z, 1)
                    if (this._isOnEdge(point)) {
                        hitPoints.push(point)
                        break
                    }
                }
            }
            lastPoint = point
            lastX = this._directionOringin.lt.x + offset * i
        }

        const leftPoints = hitPoints.filter(point => point.x === 0)
        const rightPoints = hitPoints.filter(point => point.x === -this._roomSize.widthDraw)
        const topPoints = hitPoints.filter(point => point.y === this._roomSize.heightDraw)
        const bottomPoints = hitPoints.filter(point => point.y === 0)
        const frontPoints = hitPoints.filter(point => point.z === toFixedNumber(this._screenOffset, 1))

        this._cutPoints.top.left = leftPoints
        this._cutPoints.top.right = rightPoints
        this._cutPoints.top.top = topPoints
        this._cutPoints.top.bottom = bottomPoints
        this._cutPoints.top.front = frontPoints
    }

    _calcBottomBoundConnorPoints() {
        const hitPoints = []

        const offset = (this._directionOringin.lb.x - this._directionOringin.rb.x) / this.cutDivide
        let lastPoint, lastX
        for (let i = 0; i <= this.cutDivide + 1; i++) {
            const direction = this._directionOringin.rb.clone()
            direction.x += offset * i
            direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
            direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
            const point = this._calcHitPoint(this._projectorCenter, direction)
            if (lastPoint && this._isInDifferentPlane(lastPoint, point)) {
                const offsetSub = offset / this.subDivide
                for (let j = 0; j <= this.subDivide; j++) {
                    const directionSub = this._directionOringin.rb.clone()
                    directionSub.x = lastX + offsetSub * j
                    directionSub.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
                    directionSub.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
                    const point = this._calcHitPoint(this._projectorCenter, directionSub)
                    point.x = toFixedNumber(point.x, 1)
                    point.y = toFixedNumber(point.y, 1)
                    point.z = toFixedNumber(point.z, 1)
                    if (this._isOnEdge(point)) {
                        hitPoints.push(point)
                        break
                    }
                }
            }
            lastPoint = point
            lastX = this._directionOringin.rb.x + offset * i
        }

        const leftPoints = hitPoints.filter(point => point.x === 0)
        const rightPoints = hitPoints.filter(point => point.x === -this._roomSize.widthDraw)
        const topPoints = hitPoints.filter(point => point.y === this._roomSize.heightDraw)
        const bottomPoints = hitPoints.filter(point => point.y === 0)
        const frontPoints = hitPoints.filter(point => point.z === toFixedNumber(this._screenOffset, 1))

        this._cutPoints.bottom.left = leftPoints
        this._cutPoints.bottom.right = rightPoints
        this._cutPoints.bottom.top = topPoints
        this._cutPoints.bottom.bottom = bottomPoints
        this._cutPoints.bottom.front = frontPoints
    }

    _isInDifferentPlane(point1, point2) {
        let plane1, plane2
        for (const planeName in this._plane) {
            const plane = this._plane[planeName]
            if (plane.distanceToPoint(point1) === 0) {
                plane1 = planeName
            }
            if (plane.distanceToPoint(point2) === 0) {
                plane2 = planeName
            }
        }

        return plane1 !== plane2
    }

    _isOnEdge(point) {
        return (point.x === 0 && point.z === toFixedNumber(this._screenOffset, 1)) ||
            (point.x === 0 && point.y === 0) ||
            (point.x === 0 && point.y === this._roomSize.heightDraw) ||
            (point.y === 0 && point.z === toFixedNumber(this._screenOffset, 1)) ||
            (point.y === this._roomSize.heightDraw && point.z === toFixedNumber(this._screenOffset, 1)) ||
            (point.x === -this._roomSize.widthDraw && point.y === 0) ||
            (point.x === -this._roomSize.widthDraw && point.y === this._roomSize.heightDraw) ||
            (point.x === -this._roomSize.widthDraw && point.z === toFixedNumber(this._screenOffset, 1))
    }

    _isCornorLighted(cornor) {
        let CornorDirection
        switch (cornor) {
            case 'lt':
                CornorDirection = new Vector3(0 - this._projectorCenter.x, this._roomSize.heightDraw - this._projectorCenter.y, this._screenOffset - this._projectorCenter.z)
                break
            case 'rt':
                CornorDirection = new Vector3(-this._roomSize.widthDraw - this._projectorCenter.x, this._roomSize.heightDraw - this._projectorCenter.y, this._screenOffset - this._projectorCenter.z)
                break
            case 'lb':
                CornorDirection = new Vector3(0 - this._projectorCenter.x, 0 - this._projectorCenter.y, this._screenOffset - this._projectorCenter.z)
                break
            case 'rb':
                CornorDirection = new Vector3(-this._roomSize.widthDraw - this._projectorCenter.x, 0 - this._projectorCenter.y, this._screenOffset - this._projectorCenter.z)
                break
        }

        const ray = new Ray(this._projectorCenter, CornorDirection)

        const intersect1 = ray.intersectTriangle(this._hitPoints.lt, this._hitPoints.rt, this._hitPoints.lb, false, new Vector3())
        const intersect2 = ray.intersectTriangle(this._hitPoints.lb, this._hitPoints.rb, this._hitPoints.lt, false, new Vector3())
        const intersect3 = ray.intersectTriangle(this._hitPoints.lt, this._hitPoints.rt, this._hitPoints.rb, false, new Vector3())
        const intersect4 = ray.intersectTriangle(this._hitPoints.lb, this._hitPoints.rb, this._hitPoints.rt, false, new Vector3())

        if (intersect1 || intersect2 || intersect3 || intersect4) {
            return true
        }
        return false
    }

    _generateLightBound() {
        Object.values(this._lightBound.geometrys).forEach(geometry => {
            geometry && geometry.dispose()
        })
        Object.values(this._lightBound.objects).forEach(object => {
            object && this._scene.remove(object)
        })

        const pointsLT = []
        pointsLT.push(this._projectorCenter)
        pointsLT.push(this._hitPoints.lt)
        this._lightBound.geometrys.lt = new BufferGeometry().setFromPoints(pointsLT)
        this._lightBound.objects.lt = new Line(this._lightBound.geometrys.lt, this._lightBound.material)
        this._scene.add(this._lightBound.objects.lt)

        const pointsRT = []
        pointsRT.push(this._projectorCenter)
        pointsRT.push(this._hitPoints.rt)
        this._lightBound.geometrys.rt = new BufferGeometry().setFromPoints(pointsRT)
        this._lightBound.objects.rt = new Line(this._lightBound.geometrys.rt, this._lightBound.material)
        this._scene.add(this._lightBound.objects.rt)

        const pointsRB = []
        pointsRB.push(this._projectorCenter)
        pointsRB.push(this._hitPoints.rb)
        this._lightBound.geometrys.rb = new BufferGeometry().setFromPoints(pointsRB)
        this._lightBound.objects.rb = new Line(this._lightBound.geometrys.rb, this._lightBound.material)
        this._scene.add(this._lightBound.objects.rb)

        const pointsLB = []
        pointsLB.push(this._projectorCenter)
        pointsLB.push(this._hitPoints.lb)
        this._lightBound.geometrys.lb = new BufferGeometry().setFromPoints(pointsLB)
        this._lightBound.objects.lb = new Line(this._lightBound.geometrys.lb, this._lightBound.material)
        this._scene.add(this._lightBound.objects.lb)
    }

    _calcHitPoints() {
        const direction = new Vector3()

        direction.set(Math.tan(this._fixedAngleLeft * Math.PI / 180),
            Math.tan(this._fixedAngleTop * Math.PI / 180),
            1)
        this._directionOringin.lt = direction.clone()
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._hitPoints.lt = this._calcHitPoint(this._projectorCenter, direction.normalize())
        direction.set(Math.tan(this._minFixedAngleH * Math.PI / 180),
            Math.tan(this._maxFixedAngleV * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._movableAreaPoints.lt = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')
        direction.set(Math.tan(this._aspectAngleLeft * Math.PI / 180),
            Math.tan(this._aspectAngleTop * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._aspectRatioPoints.lt = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')

        direction.set(-Math.tan(this._fixedAngleRight * Math.PI / 180),
            Math.tan(this._fixedAngleTop * Math.PI / 180),
            1)
        this._directionOringin.rt = direction.clone()
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._hitPoints.rt = this._calcHitPoint(this._projectorCenter, direction.normalize())
        direction.set(-Math.tan(this._maxFixedAngleH * Math.PI / 180),
            Math.tan(this._maxFixedAngleV * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._movableAreaPoints.rt = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')
        direction.set(-Math.tan(this._aspectAngleRight * Math.PI / 180),
            Math.tan(this._aspectAngleTop * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._aspectRatioPoints.rt = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')

        direction.set(-Math.tan(this._fixedAngleRight * Math.PI / 180),
            -Math.tan(this._fixedAngleBottom * Math.PI / 180),
            1)
        this._directionOringin.rb = direction.clone()
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._hitPoints.rb = this._calcHitPoint(this._projectorCenter, direction.normalize())
        direction.set(-Math.tan(this._maxFixedAngleH * Math.PI / 180),
            -Math.tan(this._minFixedAngleV * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._movableAreaPoints.rb = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')
        direction.set(-Math.tan(this._aspectAngleRight * Math.PI / 180),
            -Math.tan(this._aspectAngleBottom * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._aspectRatioPoints.rb = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')

        direction.set(Math.tan(this._fixedAngleLeft * Math.PI / 180),
            -Math.tan(this._fixedAngleBottom * Math.PI / 180),
            1)
        this._directionOringin.lb = direction.clone()
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._hitPoints.lb = this._calcHitPoint(this._projectorCenter, direction.normalize())
        direction.set(Math.tan(this._minFixedAngleH * Math.PI / 180),
            -Math.tan(this._minFixedAngleV * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._movableAreaPoints.lb = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')
        direction.set(Math.tan(this._aspectAngleLeft * Math.PI / 180),
            -Math.tan(this._aspectAngleBottom * Math.PI / 180),
            1)
        direction.applyAxisAngle(this.axisX, -this._angleV * Math.PI / 180)
        direction.applyAxisAngle(this.axisY, -this._angleH * Math.PI / 180)
        this._aspectRatioPoints.lb = this._calcPlanePoint(this._projectorCenter, direction.normalize(), 'front')

        store.dispatch('coordinate/setHitPoints', {
            lt: this._toRealSize(this._hitPoints.lt),
            rt: this._toRealSize(this._hitPoints.rt),
            lb: this._toRealSize(this._hitPoints.lb),
            rb: this._toRealSize(this._hitPoints.rb)
        })
        store.dispatch('coordinate/setMovableAreaPoints', {
            lt: this._toRealSize(this._movableAreaPoints.lt),
            rt: this._toRealSize(this._movableAreaPoints.rt),
            lb: this._toRealSize(this._movableAreaPoints.lb),
            rb: this._toRealSize(this._movableAreaPoints.rb)
        })
        store.dispatch('coordinate/setMovableAreaPoints', {
            lt: this._toRealSize(this._movableAreaPoints.lt),
            rt: this._toRealSize(this._movableAreaPoints.rt),
            lb: this._toRealSize(this._movableAreaPoints.lb),
            rb: this._toRealSize(this._movableAreaPoints.rb)
        })
        store.dispatch('coordinate/setAspectRatioPoints', {
            lt: this._toRealSize(this._aspectRatioPoints.lt),
            rt: this._toRealSize(this._aspectRatioPoints.rt),
            lb: this._toRealSize(this._aspectRatioPoints.lb),
            rb: this._toRealSize(this._aspectRatioPoints.rb)
        })
    }

    _calcPlanePoints() {
        // 从lb开始顺时针切割
        this._calcLeftBoundConnorPoints()
        this._calcTopBoundConnorPoints()
        this._calcRightBoundConnorPoints()
        this._calcBottomBoundConnorPoints()

        const cutPoints = {}
        extend(true, cutPoints, this._cutPoints)
        Object.keys(cutPoints).forEach(key => {
            Object.keys(cutPoints[key]).forEach(subKey => {
                cutPoints[key][subKey] = cutPoints[key][subKey].map(o => this._toRealSize(o))
            })
        })
        store.dispatch('coordinate/setCutPoints', cutPoints)

        this._calcLeftPoints()
        this._calcRightPoints()
        this._calcBottomPoints()
        this._calcTopPoints()
        this._calcFrontPoints()

        store.dispatch('coordinate/setLeftPoints', this._planePoints.left.map(point => this._toRealSize(point)))
        store.dispatch('coordinate/setRightPoints', this._planePoints.right.map(point => this._toRealSize(point)))
        store.dispatch('coordinate/setBottomPoints', this._planePoints.bottom.map(point => this._toRealSize(point)))
        store.dispatch('coordinate/setTopPoints', this._planePoints.top.map(point => this._toRealSize(point)))
        store.dispatch('coordinate/setFrontPoints', this._planePoints.front.map(point => this._toRealSize(point)))
    }

    _calcHitPoint(oringin, direction) {
        if (oringin.y === 0) {
            oringin.y = 0.05
        }
        if (oringin.y === this._roomSize.heightDraw) {
            oringin.y = this._roomSize.heightDraw - 0.05
        }
        if (oringin.x === 0) {
            oringin.x = -0.05
        }
        if (oringin.x === -this._roomSize.widthDraw) {
            oringin.x = -this._roomSize.widthDraw + 0.05
        }
        const minDistanceVector3 = { point: null, distance: Number.MAX_VALUE }
        const ray = new Ray(oringin, direction)
        for (const planeName in this._plane) {
            const plane = this._plane[planeName]
            const vector = new Vector3()
            const hitPoint = ray.intersectPlane(plane, vector)
            if (hitPoint) {
                const distance = vector.distanceTo(oringin)
                if (distance < minDistanceVector3.distance) {
                    minDistanceVector3.distance = distance
                    minDistanceVector3.point = vector
                }
            }
        }
        const hitPoint = minDistanceVector3.point
        if (hitPoint) {
            hitPoint.x = toFixedNumber(hitPoint.x, 3)
            hitPoint.y = toFixedNumber(hitPoint.y, 3)
            hitPoint.z = toFixedNumber(hitPoint.z, 3)
        } else {
            return oringin
        }
        return hitPoint
    }

    _calcPlanePoint(oringin, direction, planeName) {
        const ray = new Ray(oringin, direction)
        const plane = this._plane[planeName]
        const vector = new Vector3()
        const hitPoint = ray.intersectPlane(plane, vector)
        if (hitPoint) {
            hitPoint.x = toFixedNumber(hitPoint.x, 3)
            hitPoint.y = toFixedNumber(hitPoint.y, 3)
            hitPoint.z = toFixedNumber(hitPoint.z, 3)
        } else {
            return null
        }
        return vector
    }

    _toRealSize(point) {
        if (!point) {
            return null
        }
        return {
            x: point.x / this._roomSize.ratio,
            y: point.y / this._roomSize.ratio,
            z: point.z / this._roomSize.ratio
        }
    }
}
