export const Config = {
  port: parseInt(process.env.PORT || '3000'),
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo_db:27017/coffeemug',
};
