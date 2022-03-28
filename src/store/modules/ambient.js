const ambient = {
    namespaced: true,
    state: {
        roomBrightness: 200,
        screenGain: 1
    },
    mutations: {
        SET_ROOM_BRIGHTNESS: (state, roomBrightness) => {
            state.roomBrightness = roomBrightness
        },
        SET_SCREEN_GAIN: (state, screenGain) => {
            state.screenGain = screenGain
        },
        SET_AMBIENT_HISTORY: (state, history) => {
            state.roomBrightness = history.roomBrightness
            state.screenGain = history.screenGain
        }
    }
}

export default ambient
