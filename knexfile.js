module.exports = {
  
    development: {
      client: 'pg',
      connection: 'postgres://localhost/hanging_challenge',
      debug: true
    },
  
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL + '?ssl=true'
    }
  
  };