const {DataTypes}= require('sequelize');
const db=require('./database');
const CumRap = require('./CumRap');
const Rap=db.define('Rap',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        primaryKey:true,
        autoIncrement:true
    },
    Ten:{
        type:DataTypes.STRING,
        allowNull:false
    },
    LoaiRap:{
        type:DataTypes.STRING,
        allowNull:false
    },
    KTNgang:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    KTDoc:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})
Rap.belongsTo(CumRap);
module.exports=Rap;