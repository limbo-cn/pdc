import store from '../store'

export const getTextWidth = (text, font) => {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
    const context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
}

export const toFixedNumber = (number, decimal) => {
    if (!Number.isFinite(number)) {
        return 0
    }
    return +number.toFixed(decimal)
}

export const debounced = (fn, wait, immediate) => {
    let timer
    return function () {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) {
                fn.apply(this, arguments)
            }
        } else {
            timer = setTimeout(() => {
                fn.apply(this, arguments)
            }, wait)
        }
    }
}

export const throttled = (func, wait, options) => {
    let time, context, args
    let previous = 0
    if (!options) options = {}

    const later = function () {
        previous = options.leading === false ? 0 : new Date().getTime()
        time = null
        func.apply(context, args)
        if (!time) context = args = null
    }

    const throttled = function () {
        const now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        const remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (time) {
                clearTimeout(time)
                time = null
            }
            previous = now
            func.apply(context, args)
            if (!time) context = args = null
        } else if (!time && options.trailing !== false) {
            time = setTimeout(later, remaining)
        }
    }
    return throttled
}

export const downloadFile = (fileName, content) => {
    const aLink = document.createElement('a')
    const blob = base64ToBlob(content)

    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true)
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)

    aLink.click()

    aLink.remove()
}

export const base64ToBlob = code => {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length

    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
}

export const calcFromScreenMin = () => {
    return store.state.screen.lockScreenSize ? (store.state.screen.width * store.state.projector.throwRatioMin) : store.getters['projector/distance'].min
}

export const calcFromScreenMax = () => {
    const screenOffset = store.state.screen.screenOffset
    const maxAsSideview = store.state.room.height * store.state.projector.throwRatio * store.state.screen.aspectRatio
    const maxAsTopView = store.state.room.width * store.state.projector.throwRatio
    const roomMax = store.state.room.depth
    const max = Math.min(Math.min(maxAsSideview, maxAsTopView) * 0.9 + screenOffset, roomMax)
    if (store.state.screen.lockScreenSize) {
        return Math.min(max, store.state.screen.width * store.state.projector.throwRatioMax)
    } else {
        return max
    }
}

export const GetQueryString = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}

export const filterLensShift = o => {
    return !!o['Lens Shift']
}

export const filterOptionalLens = o => {
    return !!o['Optional Lens']
}

export const filterThrowDistance = (o, input) => {
    const throwDistance = input / store.state.common.unitRatio
    if (!o.Distance) {
        for (let i = 0; i < o['Optional Lens'].length; i++) {
            const lens = store.state.dataSource.projectorLens.optionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
            if (!lens) {
                continue
            } else if (lens.Distance.max >= throwDistance && lens.Distance.min <= throwDistance) {
                return true
            }
            continue
        }
        return false
    }
    return o.Distance.min <= throwDistance && o.Distance.max >= throwDistance
}

export const filterModelName = (o, input) => {
    return o.ModelName.toLowerCase().includes(input.toLowerCase())
}

export const filterBrightness = (o, input) => {
    const [min, max] = input.split('-')
    return o.Brightness.value >= +min && o.Brightness.value <= +max
}

export const filterResolution = (o, input) => {
    return o.Resolution.Desc === input
}

export const filterAspectRatio = (o, input) => {
    return o.AspectRatio === input
}

export const filterThrowRatio = (o, input) => {
    const [min, max] = input.split('-')
    if (!o['Throw Ratio']) {
        for (let i = 0; i < o['Optional Lens'].length; i++) {
            const lens = store.state.dataSource.projectorLens.optionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
            if (!lens) {
                continue
            } else if ((lens['Throw Ratio'].min >= +min && lens['Throw Ratio'].min <= +max) || (lens['Throw Ratio'].max >= +min && lens['Throw Ratio'].max <= +max)) {
                return true
            }
            continue
        }
        return false
    }
    return (o['Throw Ratio'].min >= +min && o['Throw Ratio'].min <= +max) || (o['Throw Ratio'].max >= +min && o['Throw Ratio'].max <= +max)
}
