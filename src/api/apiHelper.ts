

export const handlerFilePath = (path) => {
    return (import.meta.env.DEV ? '/api' : '')  + path
}