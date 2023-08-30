

export const handlerStaticFilePath = (path) => {
    return (import.meta.env.DEV ? '/api' : '')  + path
}