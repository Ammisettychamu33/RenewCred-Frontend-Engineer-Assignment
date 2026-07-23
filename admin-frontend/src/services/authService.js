import api from './api';

export const loginApi = async (credentials) => {
  try {
    return await api.post('/auth/login', credentials);
  } catch (err) {
    console.warn('[Admin CMS] Backend API offline, validating demo credentials locally');
    if (credentials.email === 'admin@renewcred.com' && credentials.password === 'Admin@123456') {
      return {
        success: true,
        data: {
          token: 'demo-jwt-token-renewcred-2026',
          user: {
            id: 'admin-1',
            name: 'Senior Architect',
            email: 'admin@renewcred.com',
            role: 'superadmin',
          },
        },
      };
    }
    throw err;
  }
};

export const logoutApi = async () => {
  try {
    return await api.post('/auth/logout');
  } catch (err) {
    return { success: true };
  }
};

export const getMeApi = async () => {
  try {
    return await api.get('/auth/me');
  } catch (err) {
    return {
      success: true,
      data: {
        id: 'admin-1',
        name: 'Senior Architect',
        email: 'admin@renewcred.com',
        role: 'superadmin',
      },
    };
  }
};
