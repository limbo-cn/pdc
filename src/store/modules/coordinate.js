const coordinate = {
    namespaced: true,
    state: {
        hitPoints: { lt: { x: 0, y: 0, z: 0 }, rt: { x: 0, y: 0, z: 0 }, lb: { x: 0, y: 0, z: 0 }, rb: { x: 0, y: 0, z: 0 } },
        cutPoints: {
            left: { front: [], left: [], top: [], right: [], bottom: [] },
            top: { front: [], left: [], top: [], right: [], bottom: [] },
            right: { front: [], left: [], top: [], right: [], bottom: [] },
            bottom: { front: [], left: [], top: [], right: [], bottom: [] }
        },
        leftPoints: [],
        rightPoints: [],
        topPoints: [],
        bottomPoints: [],
        frontPoints: [],
        movableAreaPoints: { lt: { x: 0, y: 0, z: 0 }, rt: { x: 0, y: 0, z: 0 }, lb: { x: 0, y: 0, z: 0 }, rb: { x: 0, y: 0, z: 0 } },
        aspectRatioPoints: { lt: { x: 0, y: 0, z: 0 }, rt: { x: 0, y: 0, z: 0 }, lb: { x: 0, y: 0, z: 0 }, rb: { x: 0, y: 0, z: 0 } }
    },
    mutations: {
        SET_HIT_POINTS: (state, hitPoints) => {
            state.hitPoints = hitPoints
        },
        SET_CUT_POINTS: (state, cutPoints) => {
            state.cutPoints = cutPoints
        },
        SET_LEFT_POINTS: (state, leftPoints) => {
            state.leftPoints = leftPoints
        },
        SET_RIGHT_POINTS: (state, rightPoints) => {
            state.rightPoints = rightPoints
        },
        SET_TOP_POINTS: (state, topPoints) => {
            state.topPoints = topPoints
        },
        SET_BOTTOM_POINTS: (state, bottomPoints) => {
            state.bottomPoints = bottomPoints
        },
        SET_FRONT_POINTS: (state, frontPoints) => {
            state.frontPoints = frontPoints
        },
        SET_MOVABLE_AREA_POINTS: (state, movableAreaPoints) => {
            state.movableAreaPoints = movableAreaPoints
        },
        SET_ASPECT_RATIO_POINTS: (state, aspectRatioPoints) => {
            state.aspectRatioPoints = aspectRatioPoints
        }
    },
    actions: {
        setHitPoints({ commit }, hitPoints) {
            commit('SET_HIT_POINTS', hitPoints)
        },
        setCutPoints({ commit }, cutPoints) {
            commit('SET_CUT_POINTS', cutPoints)
        },
        setLeftPoints({ commit }, leftPoints) {
            commit('SET_LEFT_POINTS', leftPoints)
        },
        setRightPoints({ commit }, rightPoints) {
            commit('SET_RIGHT_POINTS', rightPoints)
        },
        setTopPoints({ commit }, topPoints) {
            commit('SET_TOP_POINTS', topPoints)
        },
        setBottomPoints({ commit }, bottomPoints) {
            commit('SET_BOTTOM_POINTS', bottomPoints)
        },
        setFrontPoints({ commit }, frontPoints) {
            commit('SET_FRONT_POINTS', frontPoints)
        },
        setMovableAreaPoints({ commit }, movableAreaPoints) {
            commit('SET_MOVABLE_AREA_POINTS', movableAreaPoints)
        },
        setAspectRatioPoints({ commit }, aspectRatioPoints) {
            commit('SET_ASPECT_RATIO_POINTS', aspectRatioPoints)
        }
    },
    getters: {
        hitPoints: state => state.hitPoints,
        cutPoints: state => state.cutPoints,
        leftPoints: state => state.leftPoints,
        rightPoints: state => state.rightPoints,
        topPoints: state => state.topPoints,
        bottomPoints: state => state.bottomPoints,
        frontPoints: state => state.frontPoints,
        movableAreaPoints: state => state.movableAreaPoints,
        aspectRatioPoints: state => state.aspectRatioPoints
    }
}

export default coordinate
