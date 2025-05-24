import { ref } from 'vue'
import { h } from 'vue'

export enum LoadingType {
    COMMON,
    LIST_BOTTOM,
    PULSE,
    DOTS,
    CIRCLE
}

export interface LoadingOptions {
    type?: LoadingType
    text?: string
    color?: string
    size?: number
    background?: string
}

const defaultOptions: LoadingOptions = {
    type: LoadingType.COMMON,
    text: '',
    color: '#6900ff',
    size: 24,
    background: 'rgba(255,255,255,.9)'
}

function createLoadingComponent(options: LoadingOptions = {}) {
    const mergedOptions = { ...defaultOptions, ...options }
    const { type, text, color, size, background } = mergedOptions

    const loadingStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background,
        backdropFilter: 'blur(4px)',
        zIndex: 9999
    }

    const renderLoadingContent = () => {
        switch (type) {
            case LoadingType.PULSE:
                return h('div', {
                    style: {
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: '50%',
                        background: color,
                        animation: 'pulse 1.2s ease-in-out infinite'
                    }
                })
            case LoadingType.DOTS:
                return h('div', {
                    style: {
                        display: 'flex',
                        gap: '4px'
                    }
                }, [
                    h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: color, animation: 'dots 1.4s infinite ease-in-out both' } }),
                    h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: color, animation: 'dots 1.4s infinite ease-in-out both 0.2s' } }),
                    h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: color, animation: 'dots 1.4s infinite ease-in-out both 0.4s' } })
                ])
            case LoadingType.CIRCLE:
                return h('div', {
                    style: {
                        width: `${size}px`,
                        height: `${size}px`,
                        border: `2px solid ${color}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }
                })
            default:
                return h('div', {
                    style: {
                        width: `${size}px`,
                        height: `${size}px`,
                        position: 'relative'
                    }
                }, [
                    h('div', {
                        style: {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: `2px solid ${color}`,
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }
                    }),
                    h('div', {
                        style: {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: `2px solid ${color}`,
                            borderRightColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.5s linear infinite reverse'
                        }
                    })
                ])
        }
    }

    return h('div', { style: loadingStyles }, [
        renderLoadingContent(),
        text && h('div', {
            style: {
                marginTop: '8px',
                color: color,
                fontSize: '12px',
                fontWeight: 500
            }
        }, text)
    ])
}

export const useLoadingOptions = (options: LoadingOptions = {}) => {
    return createLoadingComponent(options)
}

// 添加全局样式
const style = document.createElement('style')
style.textContent = `
@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.5; }
}

@keyframes dots {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}
`
document.head.appendChild(style)

export const loadingBottom = () => {
    return createLoadingComponent({
        type: LoadingType.DOTS,
        size: 18,
        color: '#6900ff'
    })
}

