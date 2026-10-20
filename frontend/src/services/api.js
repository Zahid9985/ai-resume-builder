import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120000
});

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  // Let the browser set multipart/form-data with its boundary parameter.
  const response = await api.post('/resumes/upload', formData);
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
  try {
    const response = await api.post('/resumes/pdf', payload, { responseType: 'blob' });
    const pdfBlob = response.data;
    const pdfHeader = await pdfBlob.slice(0, 5).text();
    if (pdfHeader !== '%PDF-') {
      let body = null;
      try {
        body = JSON.parse(await pdfBlob.text());
      } catch {
        // The response was neither a PDF nor a JSON API error.
      }
      const downloadError = new Error(body?.error?.message || 'The server returned an invalid PDF. Please try again.');
      downloadError.response = { data: body || {} };
      throw downloadError;
    }

    const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored-resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Let Chrome finish opening the blob URL before releasing it. Revoking it
    // in the same tick as click() can produce an empty/corrupt downloaded PDF.
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    // Axios returns error bodies as blobs when responseType is "blob". Decode
    // the JSON API error so the builder can show the backend's useful message.
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await data.text());
      } catch {
        // Keep the original Axios error when the body is not JSON.
      }
    }
    throw error;
  }
}

export function getErrorMessage(error) {
  if (error?.code === 'ERR_NETWORK' || (error?.request && !error?.response)) {
    return 'Cannot reach the API on port 5000. Start or restart the backend. Restart the frontend on port 5173 only if its Vite configuration changed.';
  }
  const apiError = error?.response?.data?.error;
  if (apiError?.debug) return apiError.debug;
  const fieldErrors = apiError?.details?.fieldErrors;
  if (fieldErrors) {
    const firstError = Object.entries(fieldErrors).find(([, messages]) => messages?.length)?.[0];
    if (firstError) {
      const message = fieldErrors[firstError][0];
      const fieldName = firstError === 'jobDescription' ? 'Role description' : firstError === 'resumeText' ? 'Resume text' : firstError;
      return `${fieldName}: ${message}`;
    }
  }
  return apiError?.message || error?.message || 'Something went wrong.';
}
