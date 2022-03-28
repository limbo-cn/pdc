import { unitType, installationType } from '../../helper/enum'
import { i18n } from '../../boot/i18n'

const common = {
    namespaced: true,
    state: {
        leftDrawerOpen: false,
        unit: unitType.m,
        unitLabel: i18n.t('m'),
        unitRatio: 1,
        installation: installationType.desktop,
        views: ['SideView', 'FrontView', 'TopView', 'ThreeView'],
        selectedView: null,
        layoutModel: 'grid'
    },
    mutations: {
        SET_LEFT_DRAWER_OPEN: (state, bShow) => {
            state.leftDrawerOpen = bShow
        },
        SET_UNIT: (state, unit) => {
            state.unit = unit
        },
        SET_UNIT_LABEL: (state, unitLabel) => {
            state.unitLabel = unitLabel
        },
        SET_UNIT_RATIO: (state, unitRatio) => {
            state.unitRatio = unitRatio
        },
        SET_INSTALLATION: (state, installation) => {
            state.installation = installation
        },
        SET_VIEWS: (state, views) => {
            state.views = views
        },
        SET_SELECTED_VIEW: (state, view) => {
            state.selectedView = view
        },
        SET_LAYOUT_MODEL: (state, layoutModel) => {
            state.layoutModel = layoutModel
        },
        SET_COMMON_HISTORY: (state, commonHistory) => {
            state.unit = commonHistory.unit
            state.unitLabel = commonHistory.unitLabel
            state.unitRatio = commonHistory.unitRatio
            state.installation = commonHistory.installation
        }
    },
    actions: {
        setLeftDrawerOpen({ commit }, bShow) {
            commit('SET_LEFT_DRAWER_OPEN', bShow)
        },
        setUnit({ commit }, unit) {
            commit('SET_UNIT', unit)
        },
        setInstallation({ commit }, installation) {
            commit('SET_INSTALLATION', installation)
        },
        switchViews({ state, commit }, { view1, view2 }) {
            const index1 = state.views.findIndex(o => o === view1)
            const index2 = state.views.findIndex(o => o === view2)
            const views = [...state.views]
            if (index1 >= 0 && index2 >= 0) {
                views[index1] = view2
                views[index2] = view1
                commit('SET_VIEWS', views)
            }
        }
    },
    getters: {
        leftDrawerOpen: state => state.leftDrawerOpen,
        unit: state => state.unit,
        installation: state => state.installation,
        views: state => state.views
    }
}

export default common
