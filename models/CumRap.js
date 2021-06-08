const { DataTypes } = require('sequelize');
const db = require('./database');


const CumRap=db.define('CumRap',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    Ten: {
        type: DataTypes.STRING,
        allowNull: false
      },
    DiaChi: {
        type: DataTypes.STRING,
        allowNull: false
      }
});
module.exports=CumRap;