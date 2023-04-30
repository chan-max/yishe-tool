import axios from 'axios'

// 全局设置
axios.defaults.timeout = 10000 // 时间超时设置10s
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

const apiInstance = axios.create()

apiInstance.defaults.baseURL = 'http://localhost:3000'

apiInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use = apiInstance.interceptors.request.use


apiInstance.interceptors.request.use(
    config => {
        if ((window as any).token) {
            config.headers.Authorization = (window as any).token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

apiInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

export default apiInstance