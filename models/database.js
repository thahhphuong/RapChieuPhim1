const { Sequelize } = require('sequelize');
module.exports = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/data',{
  dialect:'postgres',
  protocol: 'postgres',
  
  dialectOptions: {
    ssl: {
      //require: true,
      rejectUnauthorized: false,
    }, 
  }
});
