const { hash } = require('bcrypt');
const { DataTypes } = require('sequelize');
const db = require('./database');

const User = db.define('User', {
  // Model attributes are defined here
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true
    
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password:{
    type: DataTypes.STRING,
    allowNull: false
  },
  UserType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PhoneNumber:{
    type:DataTypes.INTEGER,
    allowNull:false
  }
});


User.findByUsername = async function(Email){
  return User.findOne({
    where:{
      Email,
    },
  });
};

User.findById = async function(id){
  return User.findByPk(id);
};

User.add = async function(email,username, password,hash){
  const user = User.create({
    Email:username,
    username:password,
    Password: hash,
    UserType:'2',
    PhoneNumber:email,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  return user;
};
module.exports = User;
