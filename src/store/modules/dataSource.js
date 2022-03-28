import projectorType from '../../assets/dataSource/vvkProjectorTypes.json'
import projectorModels from '../../assets/dataSource/vvkProjectorModels.json'
import projectorLens from '../../assets/dataSource/vvkOptionalLens.json'

const dataSource = {
    namespaced: true,
    state: {
        projectorType: projectorType,
        projectorModels: projectorModels,
        projectorLens: projectorLens,
        selectedModelName: 'DH833',
        selectedLensName: ''
    },
    mutations: {
        SET_SELECTED_MODEL_NAME: (state, selectedModelName) => {
            state.selectedModelName = selectedModelName
        },
        SET_SELECTED_LENS_NAME: (state, selectedLensName) => {
            state.selectedLensName = selectedLensName
        }
    },
    getters: {
        projectorType: state => state.projectorType,
        projectorModels: state => state.projectorModels,
        projectorLens: state => state.projecprojectorLenstorType,
        selectedLens: state => state.projectorLens.vvkOptionalLens.find(o => o['Part Name'] === state.selectedLensName),
        selectedProjector: state => state.projectorModels.vvkProjectorModels.find(o => o.ModelName === state.selectedModelName)
    }
}

export default dataSource
