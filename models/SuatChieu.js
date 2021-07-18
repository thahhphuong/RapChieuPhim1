const {DataTypes}= require('sequelize');
const db=require('./database');
const Phim = require('./Phim');
const Rap = require('./Rap');

const SuatChieu=db.define('SuatChieu',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    ThoiGianBatDau: {
        type: DataTypes.STRING,
        allowNull: true
      },
    ThoiGianKetThuc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    GiaVe:{
        type: DataTypes.INTEGER,
        allowNull: true
      }
});
SuatChieu.belongsTo(Phim);
SuatChieu.belongsTo(Rap);
module.exports=SuatChieu;