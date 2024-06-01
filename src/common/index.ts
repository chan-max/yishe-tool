


export function formatUrl(url){
    return url.startsWith('http') ? url : 'https://' + url;
}