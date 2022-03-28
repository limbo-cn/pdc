const pdf = {
    namespaced: true,
    state: {
        sideViewImage: null,
        frontViewImage: null,
        topViewImage: null,
        threeViewImage: null
    },
    mutations: {
        SET_SIDEVIEW_IMAGE: (state, sideViewImage) => {
            state.sideViewImage = sideViewImage
        },
        SET_FRONTVIEW_IMAGE: (state, frontViewImage) => {
            state.frontViewImage = frontViewImage
        },
        SET_TOPVIEW_IMAGE: (state, topViewImage) => {
            state.topViewImage = topViewImage
        },
        SET_THREEVIEW_IMAGE: (state, threeViewImage) => {
            state.threeViewImage = threeViewImage
        }
    }
}

export default pdf
