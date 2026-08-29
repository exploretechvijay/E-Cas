import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes
})

export async function analyzeCAS(file, password, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('password', password)

  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    },
  })

  return response.data
}

export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}

export default api
