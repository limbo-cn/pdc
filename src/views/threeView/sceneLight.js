import {
    DirectionalLight
} from 'three'

export default class SceneLight {
    constructor() {
        return this._generateLight()
    }

    _generateLight() {
        const directionalLight = new DirectionalLight(0xffffff, 1)
        directionalLight.position.set(8, 10, -6)

        return directionalLight
    }
}
