const { DataTypes } = require('sequelize');
const db = require('./database');
const SuatChieu = require('./SuatChieu');
const User = require('./user');


const DatCho=db.define('DatCho',{
    id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey:true
    },
    ThoiDiemDatVe:{
        type:DataTypes.DATE,
    },
    TongTien:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
});
DatCho.belongsTo(User);
DatCho.belongsTo(SuatChieu);

module.exports=DatCho;