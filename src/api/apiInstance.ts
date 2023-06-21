import axios from 'axios'

// 全局设置
axios.defaults.timeout = 10000 // 时间超时设置10s

const apiInstance = axios.create()

apiInstance.defaults.baseURL = import.meta.env.DEV ? 'api' : '';

axios.interceptors.request.use = apiInstance.interceptors.request.use

apiInstance.interceptors.request.use(
    request => {
        if ((window as any).token) {
            request.headers.token = (window as any).token
        }
        return request
    }
)

apiInstance.interceptors.response.use(
    response => {
        if(response.headers.token){
            (window as any).token = response.headers.token
        }
        return response.data;
    }
)
export default apiInstance