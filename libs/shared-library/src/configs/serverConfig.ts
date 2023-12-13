export const API_GATEWAY_PORT = 7080;
export const WEBSOCKET_GATEWAY_PORT = 7081;
export const RABBITMQ_PORT = 5671;

// export const API_GATEWAY_HOST = 'localhost';
export const API_GATEWAY_HOST = '18.220.207.235';

export const BASE_API_GATEWAY_URL = `http://${API_GATEWAY_HOST}:${API_GATEWAY_PORT}/api-gateway`; //TODO: REMEMBER TO CHANGE THIS TO HTTPS IN PRODUCTION
