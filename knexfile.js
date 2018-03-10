module.exports = {
  
    development: {
      client: 'pg',
      connection: 'postgres://localhost/hanging_challenge',
      debug: true
    },

    windows: {
      client: 'pg',
      connection: 'postgres://dbuser:password@192.168.99.100/hanging_challenge',
      debug: true
    },
  
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL + '?ssl=true'
    }
  
  };