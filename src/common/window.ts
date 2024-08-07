

/*开启新窗口*/
export const openWindow = (
    url: string,
    opt?: {
        target?: '_self' | '_blank' | string
        noopener?: boolean
        noreferrer?: boolean
    }
) => {
    const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
    const feature: string[] = []

    noopener && feature.push('noopener=yes')
    noreferrer && feature.push('noreferrer=yes')

    window.open(url, target, feature.join(','))
}
