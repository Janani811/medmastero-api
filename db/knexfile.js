import config from "./config.js";

const knexOptions = {
  client: 'pg',
  // connection: process.env.DATABASE_URL,
  connection: {
    database: config.DB_DATABASE,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    // timezone: 'utc',
    user: config.DB_USER,
  },

  debug: config.NODE_ENV === 'development',
  // migrations: {
  //   directory: path.join(__dirname, './migrations'),
  //   tableName: 'migrations',
  // },
  // seeds: {
  //   directory: path.join(__dirname, './seeds'),
  // },
};

export default knexOptions;
