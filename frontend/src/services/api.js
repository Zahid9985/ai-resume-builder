import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 120000
});

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
}

export async function analyzeResume(payload) {
  const response = await api.post('/resumes/analyze', payload);
  return response.data.data;
}

export async function generateResume(payload) {
  const response = await api.post('/resumes/generate', payload);
  return response.data.data;
}

export async function downloadPdf(payload) {
  const response = await api.post('/resumes/pdf', payload, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tailored-resume.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function getErrorMessage(error) {
  return error?.response?.data?.error?.message || error?.message || 'Something went wrong.';
}
