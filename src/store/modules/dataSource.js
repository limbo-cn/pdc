import projectorType from '../../assets/dataSource/vvkProjectorTypes.json'
import projectorModels from '../../assets/dataSource/vvkProjectorModels.json'
import projectorLens from '../../assets/dataSource/vvkOptionalLens.json'

import projectorTypeDP from '../../assets/dataSource/DPProjectorTypes.json'
import projectorModelsDP from '../../assets/dataSource/DPProjectorModels.json'
import projectorLensDP from '../../assets/dataSource/DPOptionalLens.json'
import { GetQueryString } from 'src/helper/common'

const isDP = GetQueryString('dp') || false

const dataSource = {
    namespaced: true,
    state: {
        isDP: isDP,
        projectorType: isDP ? projectorTypeDP : projectorType,
        projectorModels: isDP ? projectorModelsDP : projectorModels,
        projectorLens: isDP ? projectorLensDP : projectorLens,
        selectedModelName: isDP ? 'E-Vision Laser 5100' : 'DH833',
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
        selectedLens: state => state.projectorLens.optionalLens.find(o => o['Part Name'] === state.selectedLensName),
        selectedProjector: state => state.projectorModels.projectorModels.find(o => o.ModelName === state.selectedModelName)
    }
}

export default dataSource
