<template>
    <q-layout view="HHH LpR LFF">
        <div id="container"></div>
    </q-layout>
</template>

<script>
import {
    WebGLRenderer, Scene, PerspectiveCamera, MeshBasicMaterial,
    Mesh, ImageLoader, Texture
    , BoxBufferGeometry
} from 'three'
export default {
    name: 'Full',
    components: {},
    mounted() {
        this.init()
        this.animate()
    },
    data() {
        return {
            renderer: null,
            scene: null,
            camera: null
        }
    },
    methods: {
        init() {
            var container = document.getElementById('container')

            this.renderer = new WebGLRenderer()
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            container.appendChild(this.renderer.domElement)

            this.scene = new Scene()

            this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
            this.camera.position.set(0, 0, 0)

            // cube
            const textures = this.getTexturesFromAtlasFile('cubetexture/sun_temple_stripe.jpg', 6)
            var materials = []
            for (let i = 0; i < 6; i++) {
                materials.push(new MeshBasicMaterial({ map: textures[i] }))
            }

            var skyBox = new Mesh(new BoxBufferGeometry(100, 100, 100), materials)
            skyBox.geometry.scale(1, 1, -1)
            this.scene.add(skyBox)

            // var material = new MeshBasicMaterial()
            // var texture = new TextureLoader().load('cubetexture/room.jpg')
            // material.map = texture

            // var skyBox = new Mesh(
            //     new SphereBufferGeometry(100, 100, 100),
            //     material
            // )
            // skyBox.geometry.scale(1, 1, -1)
            // this.scene.add(skyBox)

            window.addEventListener('resize', this.onWindowResize, false)

            var bMouseDown = false
            var x = -1
            var y = -1
            container.onmousedown = function (event) {
                event.preventDefault()
                x = event.clientX
                y = event.clientY
                bMouseDown = true
            }
            container.onmouseup = function (event) {
                event.preventDefault()
                bMouseDown = false
            }
            container.onmousemove = function (event) {
                event.preventDefault()
                if (bMouseDown) {
                    skyBox.rotation.y += -0.005 * (event.clientX - x)
                    skyBox.rotation.x += -0.005 * (event.clientY - y)
                    if (skyBox.rotation.x > Math.PI / 2) {
                        skyBox.rotation.x = Math.PI / 2
                    }
                    if (skyBox.rotation.x < -Math.PI / 2) {
                        skyBox.rotation.x = -Math.PI / 2
                    }
                    x = event.clientX
                    y = event.clientY
                }
            }
            container.onmousewheel = function (event) {
                event.preventDefault()
                if (event.wheelDelta !== 0) {
                    this.camera.fov += event.wheelDelta > 0 ? 1 : -1
                    if (this.camera.fov > 150) {
                        this.camera.fov = 150
                    } else if (this.camera.fov < 30) {
                        this.camera.fov = 30
                    }
                    this.camera.updateProjectionMatrix()
                }
            }
        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
        },
        getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
            const textures = []

            for (let i = 0; i < tilesNum; i++) {
                textures[i] = new Texture()
            }

            new ImageLoader().load(atlasImgUrl, (image) => {
                let canvas, context
                const tileWidth = image.height

                for (let i = 0; i < textures.length; i++) {
                    canvas = document.createElement('canvas')
                    context = canvas.getContext('2d')
                    canvas.height = tileWidth
                    canvas.width = tileWidth
                    context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth)
                    textures[i].image = canvas
                    textures[i].needsUpdate = true
                }
            })

            return textures
        }
    }
}
</script>
