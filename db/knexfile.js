const knexOptions = {
  client: 'pg',
  // connection: process.env.DATABASE_URL,
  connection: {
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    // timezone: 'utc',
    user: process.env.DB_USER,
  },

  debug: process.env.NODE_ENV === 'development',
  // migrations: {
  //   directory: path.join(__dirname, './migrations'),
  //   tableName: 'migrations',
  // },
  // seeds: {
  //   directory: path.join(__dirname, './seeds'),
  // },
};

module.exports = knexOptions;
