import api from './api';

export const saveLayout = async (layout) => {
  try {
    const response = await api.post('/layout/save', { layout });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save layout');
  }
};

export const getLayout = async () => {
  try {
    const response = await api.get('/layout');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch layout');
  }
};
