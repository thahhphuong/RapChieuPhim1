const {DataTypes}= require('sequelize');
const db=require('./database');
const DatCho = require('./DatCho');

const Ve=db.define('Ve',{
    id:{
        type:DataTypes.UUID,
        primaryKey: true
    },
    MaGhe:{
        type:DataTypes.STRING,
        allowNull:false
    },
    DCNgang:{
        type:DataTypes.STRING,
        allowNull:false
    },
    DCDoc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    GiaTien:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});
Ve.belongsTo(DatCho);
module.exports=Ve;