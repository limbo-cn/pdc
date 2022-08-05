import {
    WebGLRenderer, Scene, PerspectiveCamera,
    MeshToonMaterial, LineBasicMaterial, MeshLambertMaterial,
    BoxGeometry,
    DoubleSide, Vector3, Plane, Mesh
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import SceneLight from './sceneLight'
import store from '../../store'
import { calcFromScreenMax, calcFromScreenMin, toFixedNumber } from 'src/helper/common'

export default class ThreeBase {
    constructor() {
        this._renderer = null
        this._scene = null
        this._camera = null
        this._cameraPosition = [24, 50, -200]
        this._controls = null
        this._transformControl = null

        this._fixedAngleTop = 0
        this._fixedAngleBottom = 0
        this._fixedAngleLeft = 0
        this._fixedAngleRight = 0

        this._angleH = 0
        this._angleV = 0

        this._maxFixedAngleH = 0
        this._minFixedAngleH = 0
        this._maxFixedAngleV = 0
        this._minFixedAngleV = 0

        this._aspectAngleTop = 0
        this._aspectAngleBottom = 0
        this._aspectAngleLeft = 0
        this._aspectAngleRight = 0

        this._fromScreenMax = 0
        this._fromScreenMin = 0
        this._screenOffset = 0

        this._roomSize = {
            width: 0,
            height: 0,
            depth: 0,
            widthDraw: 0,
            heightDraw: 0,
            depthDraw: 0,
            ratio: 10
        }

        this._projectorCenter = new Vector3(0, 0, 0)
        this._projector = null

        this._room = {
            material: new MeshToonMaterial({ color: 0xbebebe, side: DoubleSide, transparent: true, opacity: 0.5 }),
            geometrys: { front: null, right: null, bottom: null },
            objects: { front: null, right: null, bottom: null }
        }
        this._showcase = {
            material: new MeshLambertMaterial({ color: 0xa5e9f1, emissive: 0x2569f1, side: DoubleSide }),
            materialOtherSide: new MeshLambertMaterial({ color: 0xff5a25, emissive: 0xff5a25, side: DoubleSide, transparent: true, opacity: 0.8 }),
            geometrys: { top: null, bottom: null, left: null, right: null, front: null },
            objects: { top: null, bottom: null, left: null, right: null, front: null }
        }
        this._lightBound = {
            material: new LineBasicMaterial({ color: 0x000000 }),
            geometrys: { lt: null, rt: null, lb: null, rb: null },
            objects: { lt: null, rt: null, lb: null, rb: null }
        }
        this._plane = { front: new Plane(), left: new Plane(), top: new Plane(), right: new Plane(), bottom: new Plane() }

        this.axisX = new Vector3(1, 0, 0)
        this.axisY = new Vector3(0, 1, 0)
        this.cutDivide = 50
        this.subDivide = 25

        this._directionOringin = { lt: null, rt: null, rb: null, lb: null }
        this._hitPoints = { lt: null, rt: null, rb: null, lb: null }
        this._movableAreaPoints = { lt: null, rt: null, rb: null, lb: null }
        this._aspectRatioPoints = { lt: null, rt: null, rb: null, lb: null }
        this._cutPoints = {
            left: { front: [], left: [], top: [], right: [], bottom: [] },
            top: { front: [], left: [], top: [], right: [], bottom: [] },
            right: { front: [], left: [], top: [], right: [], bottom: [] },
            bottom: { front: [], left: [], top: [], right: [], bottom: [] }
        }
        this._planePoints = { front: [], top: [], right: [], bottom: [], left: [] }
    }

    _initRenderer(domSelector) {
        this._renderer = new WebGLRenderer({
            antialias: true
        })
        document.querySelector(domSelector).appendChild(this._renderer.domElement)
        const wrapperRect = document.querySelector(domSelector).getBoundingClientRect()
        this.setRendererSize(wrapperRect.width, wrapperRect.height - 1)
        this._initCamera(wrapperRect)
    }

    _initScene() {
        this._scene = new Scene()
        this._initLight()
    }

    _initCamera(wrapperRect) {
        this._camera = new PerspectiveCamera(40, wrapperRect.width / wrapperRect.height, 0.1, 1000)
        this._camera.position.set(...this._cameraPosition)
        this._camera.lookAt(0, 0, 0)
    }

    _initRoom() {
        Object.values(this._room.geometrys).forEach(geometry => {
            geometry && geometry.dispose()
        })
        Object.values(this._room.objects).forEach(object => {
            object && this._scene.remove(object)
        })

        const width = store.state.room.width * this._roomSize.ratio
        const height = store.state.room.height * this._roomSize.ratio
        const depth = store.state.room.depth * this._roomSize.ratio
        this._roomSize.width = store.state.room.width
        this._roomSize.height = store.state.room.height
        this._roomSize.depth = store.state.room.depth
        this._roomSize.widthDraw = width
        this._roomSize.heightDraw = height
        this._roomSize.depthDraw = depth

        this._screenOffset = toFixedNumber(-store.state.screen.screenOffset * this._roomSize.ratio, 3)

        this._room.geometrys.front = new BoxGeometry(width + 1, height + 1, 1)
        this._room.objects.front = new Mesh(this._room.geometrys.front, this._room.material)
        this._room.objects.front.position.z = 1
        this._room.objects.front.position.y = height / 2
        this._room.objects.front.position.x = -width / 2
        this._scene.add(this._room.objects.front)
        this._plane.front.setFromCoplanarPoints(new Vector3(10, 0, this._screenOffset), new Vector3(0, 10, this._screenOffset), new Vector3(0, 0, this._screenOffset))

        this._room.geometrys.bottom = new BoxGeometry(width + 1, 1, depth + 1)
        this._room.objects.bottom = new Mesh(this._room.geometrys.bottom, this._room.material)
        this._room.objects.bottom.position.y = -1
        this._room.objects.bottom.position.z = -depth / 2
        this._room.objects.bottom.position.x = -width / 2
        this._scene.add(this._room.objects.bottom)
        this._plane.bottom.setFromCoplanarPoints(new Vector3(10, 0, 0), new Vector3(0, 0, 10), new Vector3(0, 0, 0))

        this._room.geometrys.right = new BoxGeometry(1, height + 1, depth + 1)
        this._room.objects.right = new Mesh(this._room.geometrys.right, this._room.material)
        this._room.objects.right.position.x = -width - 1
        this._room.objects.right.position.y = height / 2
        this._room.objects.right.position.z = -depth / 2
        this._scene.add(this._room.objects.right)
        this._plane.right.setFromCoplanarPoints(new Vector3(-width, 10, 0), new Vector3(-width, 0, 10), new Vector3(-width, 0, 0))

        this._plane.left.setFromCoplanarPoints(new Vector3(0, 10, 0), new Vector3(0, 0, 10), new Vector3(0, 0, 0))
        this._plane.top.setFromCoplanarPoints(new Vector3(10, height, 0), new Vector3(0, height, 10), new Vector3(0, height, 0))

        this._fromScreenMax = Math.min(calcFromScreenMax(), store.getters['projector/distance'].max + store.state.screen.screenOffset) * this._roomSize.ratio
        this._fromScreenMin = (calcFromScreenMin() + store.state.screen.screenOffset) * this._roomSize.ratio

        this._controls.target = new Vector3(-this._roomSize.widthDraw, 0, 0)
        this._controls.update()
    }

    _initLight() {
        const light = new SceneLight()
        this._scene.add(light)
    }

    _initControls() {
        this._controls = new OrbitControls(this._camera, this._renderer.domElement)
        this._controls.addEventListener('change', () => { })
    }

    _initTransformControl() {
        this._transformControl = new TransformControls(this._camera, this._renderer.domElement)
        this._transformControl.addEventListener('dragging-changed', event => {
            this._controls.enabled = !event.value
        })
        this._scene.add(this._transformControl)
    }

    _render() {
        this._renderer.render(this._scene, this._camera)
    }

    animate() {
        requestAnimationFrame(() => { this.animate() })
        this._render()
    }

    setRendererSize(width, height) {
        this._camera && (this._camera.aspect = width / height)
        this._camera && this._camera.updateProjectionMatrix()

        this._renderer.setSize(width, height)
    }

    setEnableTransformControl(val) {
        this._transformControl.enabled = val
        // this._controls.enabled = val
    }

    getDataUrl() {
        this._renderer.preserveDrawingBuffer = true
        this._render()// 这里只渲染一帧，否则会影响性能
        const dataUrl = this._renderer.domElement.toDataURL('image/jpeg')
        this._renderer.preserveDrawingBuffer = false
        return dataUrl
    }
}
