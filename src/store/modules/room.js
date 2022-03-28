const room = {
    namespaced: true,
    state: {
        width: 9,
        height: 6,
        depth: 12
    },
    mutations: {
        SET_WIDTH: (state, width) => {
            state.width = width
        },
        SET_HEIGHT: (state, height) => {
            state.height = height
        },
        SET_DEPTH: (state, depth) => {
            state.depth = depth
        },
        SET_ROOM_HISTORY: (state, roomHistory) => {
            state.width = roomHistory.width
            state.height = roomHistory.height
            state.depth = roomHistory.depth
        }
    },
    actions: {
        setWidth({ commit }, width) {
            commit('SET_WIDTH', width)
        },
        setHeight({ commit }, height) {
            commit('SET_HEIGHT', height)
        },
        setDepth({ commit }, depth) {
            commit('SET_DEPTH', depth)
        }
    },
    getters: {
        width: state => state.width,
        height: state => state.height,
        depth: state => state.depth
    }
}

export default room
