const history = {
    namespaced: true,
    state: {
        historys: []
    },
    mutations: {
        ADD_ITEM: (state, item) => {
            state.historys.unshift(item)
        },
        DELETE_ITEM: (state, uId) => {
            const index = state.historys.findIndex(o => o.uId === uId)
            if (index >= 0) {
                state.historys.splice(index, 1)
            }
        },
        UPDATE_ITEM: (state, { oldUid, newItem }) => {
            const index = state.historys.findIndex(o => o.uId === oldUid)
            if (index >= 0) {
                state.historys.splice(index, 1, newItem)
            }
        }
    }
}

export default history
