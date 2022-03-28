const lens = {
    namespaced: true,
    state: {
        offset: 0,
        minLensShiftH: -10,
        maxLensShiftH: 10,
        minLensShiftV: -10,
        maxLensShiftV: 10,
        lensShiftH: 0,
        lensShiftV: 0,
        enableLenShiftH: true,
        enableLenShiftV: true
    },
    mutations: {
        SET_OFFSET: (state, offset) => {
            state.offset = offset
        },
        SET_MIN_LENS_SHIFT_H: (state, minLensShiftH) => {
            state.minLensShiftH = minLensShiftH
        },
        SET_MAX_LENS_SHIFT_H: (state, maxLensShiftH) => {
            state.maxLensShiftH = maxLensShiftH
        },
        SET_MIN_LENS_SHIFT_V: (state, minLensShiftV) => {
            state.minLensShiftV = minLensShiftV
        },
        SET_MAX_LENS_SHIFT_V: (state, maxLensShiftV) => {
            state.maxLensShiftV = maxLensShiftV
        },
        SET_LENS_SHIFT_H: (state, lensShiftH) => {
            state.lensShiftH = lensShiftH
        },
        SET_LENS_SHIFT_V: (state, lensShiftV) => {
            state.lensShiftV = lensShiftV
        },
        SET_ENABLE_LENS_SHIFT_H: (state, enableLenShiftH) => {
            state.enableLenShiftH = enableLenShiftH
        },
        SET_ENABLE_LENS_SHIFT_V: (state, enableLenShiftV) => {
            state.enableLenShiftV = enableLenShiftV
        },
        SET_LENS_HISTORY: (state, lensHistory) => {
            state.offset = lensHistory.offset
            state.minLensShiftH = lensHistory.minLensShiftH
            state.maxLensShiftH = lensHistory.maxLensShiftH
            state.minLensShiftV = lensHistory.minLensShiftV
            state.maxLensShiftV = lensHistory.maxLensShiftV
            state.lensShiftH = lensHistory.lensShiftH
            state.lensShiftV = lensHistory.lensShiftV
        }
    },
    actions: {
        setMinLensShiftH({ commit }, minLensShiftH) {
            commit('SET_MIN_LENS_SHIFT_H', minLensShiftH)
        },
        setMaxLensShiftH({ commit }, maxLensShiftH) {
            commit('SET_MAX_LENS_SHIFT_H', maxLensShiftH)
        },
        setMinLensShiftV({ commit }, minLensShiftV) {
            commit('SET_MIN_LENS_SHIFT_V', minLensShiftV)
        },
        setMaxLensShiftV({ commit }, maxLensShiftV) {
            commit('SET_MAX_LENS_SHIFT_V', maxLensShiftV)
        },
        setLensShiftH({ commit }, lensShiftH) {
            commit('SET_LENS_SHIFT_H', lensShiftH)
        },
        setLensShiftV({ commit }, lensShiftV) {
            commit('SET_LENS_SHIFT_V', lensShiftV)
        }
    },
    getters: {
        minLensShiftH: state => state.minLensShiftH,
        maxLensShiftH: state => state.maxLensShiftH,
        minLensShiftV: state => state.minLensShiftV,
        maxLensShiftV: state => state.maxLensShiftV,
        lensShiftH: state => state.lensShiftH,
        lensShiftV: state => state.lensShiftV
    }
}

export default lens
