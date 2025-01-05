const config = {
  development: {
    baseURL: 'http://localhost:5000',
    timeout: 10000,
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
  }
};

export default config[process.env.NODE_ENV || 'development'];