const projector = {
    namespaced: true,
    state: {
        fromLeftside: 3,
        fromFloor: 3.5,
        fromScreen: 3,
        angleH: 0,
        angleV: 0,
        enableFromLeftside: true,
        enableFromFloor: true,
        enableFromScreen: true,
        enableAngleH: true,
        enableAngleV: true,
        throwRatioMin: 0.82,
        throwRatio: 0.9,
        throwRatioMax: 1.02,
        maxFromScreen: Number.MAX_SAFE_INTEGER,
        isUST: false,
        size: { x: 0, y: 0 },
        ustTR: null,
        defaultDiagonal: 100,
        distance: { min: 0, max: 5 }
    },
    mutations: {
        SET_FROM_LEFTSIDE: (state, fromLeftside) => {
            if (!state.enableFromLeftside) {
                return
            }
            state.fromLeftside = fromLeftside
        },
        SET_ENABLE_FROM_LEFTSIDE: (state, enableFromLeftside) => {
            state.enableFromLeftside = enableFromLeftside
        },
        SET_FROM_FLOOR: (state, fromFloor) => {
            if (!state.enableFromFloor) {
                return
            }
            state.fromFloor = fromFloor
        },
        SET_ENABLE_FROM_FLOOR: (state, enableFromFloor) => {
            state.enableFromFloor = enableFromFloor
        },
        SET_FROM_SCREEN: (state, fromScreen) => {
            if (!state.enableFromScreen) {
                return
            }
            state.fromScreen = fromScreen
        },
        SET_ENABLE_FROM_SCREEN: (state, enableFromScreen) => {
            state.enableFromScreen = enableFromScreen
        },
        SET_THROW_RATIO_MIN: (state, throwRatioMin) => {
            state.throwRatioMin = throwRatioMin
        },
        SET_THROW_RATIO: (state, throwRatio) => {
            state.throwRatio = throwRatio
        },
        SET_THROW_RATIO_MAX: (state, throwRatioMax) => {
            state.throwRatioMax = throwRatioMax
        },
        SET_ANGLE_H: (state, angleH) => {
            state.angleH = angleH
        },
        SET_ENABLE_ANGLE_H: (state, enableAngleH) => {
            state.enableAngleH = enableAngleH
        },
        SET_ANGLE_V: (state, angleV) => {
            state.angleV = angleV
        },
        SET_ENABLE_ANGLE_V: (state, enableAngleV) => {
            state.enableAngleV = enableAngleV
        },
        SET_MAX_FROM_SCREEN: (state, maxFromScreen) => {
            state.maxFromScreen = maxFromScreen
        },
        SET_IS_UST: (state, isUST) => {
            state.isUST = isUST
        },
        SET_SIZE: (state, size) => {
            state.size.x = size.x
            state.size.y = size.y
        },
        SET_UST_TR: (state, ustTR) => {
            state.ustTR = ustTR
        },
        SET_DEFAULT_DIAGONAL: (state, defaultDiagonal) => {
            state.defaultDiagonal = defaultDiagonal
        },
        SET_DISTANCE: (state, distance) => {
            state.distance.min = distance.min
            state.distance.max = distance.max
        },
        SET_PROJECTOR_HISTORY: (state, history) => {
            state.fromLeftside = history.fromLeftside
            state.fromFloor = history.fromFloor
            state.fromScreen = history.fromScreen
            state.angleH = history.angleH
            state.angleV = history.angleV
            state.throwRatioMin = history.throwRatioMin
            state.throwRatio = history.throwRatio
            state.throwRatioMax = history.throwRatioMax
            state.maxFromScreen = history.maxFromScreen
            state.isUST = history.isUST
            state.size.x = history.size.x
            state.size.y = history.size.y
            state.ustTR = history.ustTR
            state.defaultDiagonal = history.defaultDiagonal
            state.distance.x = history.distance.x
            state.distance.y = history.distance.y
        }
    },
    actions: {
        setFromLeftside({ commit, state }, fromLeftside) {
            commit('SET_FROM_LEFTSIDE', fromLeftside)
        },
        setFromFloor({ commit }, fromFloor) {
            commit('SET_FROM_FLOOR', fromFloor)
        },
        setFromScreen({ commit }, fromScreen) {
            commit('SET_FROM_SCREEN', fromScreen)
        },
        setThrowRatioMin({ commit }, throwRatioMin) {
            commit('SET_THROW_RATIO_MIN', throwRatioMin)
        },
        setThrowRatioMax({ commit }, throwRatioMax) {
            commit('SET_THROW_RATIO_MAX', throwRatioMax)
        },
        setAngleH({ commit }, angleH) {
            commit('SET_ANGLE_H', angleH)
        },
        setAngleV({ commit }, angleV) {
            commit('SET_ANGLE_V', angleV)
        },
        setMaxFromScreen({ commit }, maxFromScreen) {
            commit('SET_MAX_FROM_SCREEN', maxFromScreen)
        }
    },
    getters: {
        fromLeftside: state => state.fromLeftside,
        fromFloor: state => state.fromFloor,
        fromScreen: state => state.fromScreen,
        throwRatioMin: state => state.throwRatioMin,
        throwRatioMax: state => state.throwRatioMax,
        angleH: state => state.angleH,
        angleV: state => state.angleV,
        setMaxFromScreen: state => state.setMaxFromScreen,
        size: state => state.size,
        distance: state => {
            return {
                min: state.distance.min + (state.isUST ? state.size.x : 0),
                max: state.distance.max + (state.isUST ? state.size.x : 0)
            }
        }
    }
}

export default projector
