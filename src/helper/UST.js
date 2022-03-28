import store from '../store'
import { unitRatio } from './enum'

export const setUSTThrowRatio = (diagonal) => {
    const ustTR = store.state.projector.ustTR
    const isUST = store.state.projector.isUST
    if (!ustTR || !isUST) {
        return
    }
    const ustTRKeysReverse = Object.keys(ustTR).reverse()
    for (const key of ustTRKeysReverse) {
        if (diagonal >= +key) {
            store.commit('projector/SET_THROW_RATIO', ustTR[key])
            break
        }
    }
}

export const setUSTThrowRatioByFromScreen = (fromScreen) => {
    const ustTR = store.state.projector.ustTR
    const isUST = store.state.projector.isUST
    if (!ustTR || !isUST) {
        return
    }
    const ustTRKeysReverse = Object.keys(ustTR).reverse()
    for (const key of ustTRKeysReverse) {
        const diagonal = +key
        const aspectAngle = Math.atan(store.state.screen.aspectRatio)
        const calcFromScreen = diagonal / unitRatio.inch * Math.sin(aspectAngle) * ustTR[key]
        if (fromScreen >= calcFromScreen) {
            store.commit('projector/SET_THROW_RATIO', ustTR[key])
            break
        }
    }
}
