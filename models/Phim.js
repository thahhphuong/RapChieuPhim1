const { DataTypes } = require('sequelize');
const db = require('./database');

const Phim=db.define('Phim',{
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
    NgayCongChieu: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Poster: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    ThoiLuong:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

Phim.findByPicture = async function (id) {
    return Phim.findOne({
      attributes:['Poster'],
      where:{
        id,
      }
    });
  };

module.exports=Phim;