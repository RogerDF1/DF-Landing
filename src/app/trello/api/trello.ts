import axios from 'axios';

const MAX_RETRIES = 3;

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithRetry = async (url: string, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (error: any) {
      if (error.response?.status === 429 && i < retries - 1) {
        // Si obtenemos un error 429, esperamos antes de reintentar
        await delay(1000 * (i + 1)); // Aumentar el retraso exponencialmente
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries reached');
};
