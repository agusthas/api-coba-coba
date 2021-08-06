export const config = {
  app: {
    port: process.env.APP_PORT,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expirationTime: process.env.JWT_EXPIRATION_TIME,
  },
};
