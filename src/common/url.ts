
export function buildURL(address, query) {
  let url = address;

  // 检查地址中是否已经包含查询参数
  const hasQuery = address.includes('?');

  // 构建查询参数字符串
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  // 拼接地址和查询参数
  if (queryString) {
    url += hasQuery ? `&${queryString}` : `?${queryString}`;
  }

  return url;
}


export const cache = (fn: Function) => {
  const cache = Object.create(null);
  return ((key: string) => {
    const cached = cache[key];
    return cached === undefined ? (cache[key] = fn(key)) : cached
  })
}