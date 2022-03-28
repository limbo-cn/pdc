const screen = {
    namespaced: true,
    state: {
        width: 0,
        height: 0,
        diagonal: 0,
        screenOffset: 0,
        aspectRatio: 4 / 3,
        currentAspectRatio: 4 / 3,
        fromLeft: 0,
        fromFloor: 0,
        lockScreenSize: false
    },
    mutations: {
        SET_WIDTH: (state, width) => {
            state.width = width
        },
        SET_HEIGHT: (state, height) => {
            state.height = height
        },
        SET_DIAGONAL: (state, diagonal) => {
            state.diagonal = diagonal
        },
        SET_SCREEN_OFFSET: (state, screenOffset) => {
            state.screenOffset = screenOffset
        },
        SET_ASPECT_RATIO: (state, aspectRatio) => {
            state.aspectRatio = aspectRatio
        },
        SET_CURRENT_ASPECT_RATIO: (state, currentAspectRatio) => {
            state.currentAspectRatio = currentAspectRatio
        },
        SET_FROM_LEFT: (state, fromLeft) => {
            state.fromLeft = fromLeft
        },
        SET_FROM_FLOOR: (state, fromFloor) => {
            state.fromFloor = fromFloor
        },
        SET_LOCK_SCREENSIZE: (state, lockScreenSize) => {
            state.lockScreenSize = lockScreenSize
        },
        SET_SCREEN_HISTORY: (state, history) => {
            state.screenOffset = history.screenOffset
            state.aspectRatio = history.aspectRatio
        }
    }
}

export default screen
