import axios from 'axios'

/**
 * 인증은 httpOnly + Secure 쿠키 기반 세션을 사용한다(withCredentials).
 * 토큰을 JS에서 읽을 수 있는 localStorage/sessionStorage에 두지 않는 이유는
 * XSS 발생 시 토큰이 그대로 탈취되는 것을 막기 위함이다.
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10_000,
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)
