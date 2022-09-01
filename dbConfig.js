
const  config = {
  user:  process.env.DB_USER, // sql user
  password:  process.env.DB_PASSWORD, //sql user password
  server:  process.env.DB_SERVER, // if it does not work try- localhost
  database:  'ExercisesDB',
  options: {
    trustedConnection:  true,
    enableArithAbort:  true
  },
  port:  1433
}

module.exports = config;