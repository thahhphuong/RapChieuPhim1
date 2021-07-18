const express =  require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT = require('jsonwebtoken');
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
const User = require('../models/user');



/* router.use(function (req, res, next) {
  res.locals.title = 'Đăng nhập';
  next();
}); */
/**
 * @login
 */
router.get('/login', function (req, res) {
  res.render('auth/login');
});

router.post('/login', asyncHandler(async function (req, res) {
  const { Email, Password } = req.body;
 // const {userId} = req.session;
 var errors=[];
  const found = await User.findByUsername(Email);
  const users=await User.findOne({
    where:{
      id:found.id
    },
  });
  if(found && bcrypt.compareSync(Password, found.Password)){
    req.session.userId = found.id;
    if(found.UserType == 1){
      req.session.userId = found.id;
      return res.redirect('../admin/index');
    }
    
  }
  else{
    errors.push('Email không tồn tại hoặc mật khẩu không chính xác');
    res.render('auth/login',{
      errors:errors,
      values:req.body
    });
  }
  return res.redirect('/');
  if(errors.length > 0){
    return res.render('auth/login',
    {
      errors: errors,
      values: req.body
    });
  }
}));

router.get('/logout', function (req, res) {
  delete req.session.userId;
  res.redirect('/');
});

router.get('/forgot-password',function(req,res){
  res.render('auth/forgot-password');
});
router.post('/forgot-password',asyncHandler(async function(req,res){
  const { email } = req.body;
  const found = await User.findByUsername(email);
  if(!found) return res.render('auth/forgot-password', { message: 'Email không tồn tại' });
  const access_token = createAccessToken({ email: email });
  const CLIENT_URL = req.protocol + '://' + req.get('host');
  const url = `${CLIENT_URL}/auth/reset-password/${access_token}`;
    
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL,
      pass:process.env.PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Quên mật khẩu",
    html: `
    <div style="display: block;"> 
      <span> Vui lòng click vào link bên dưới để xác nhận email </span>
      <a href="${url}">${url}</a>
    </div>`
  });
  res.render('auth/forgot-password', { 
    status: 'confirm', 
    email: found.email 
  });

}));
router.get('/reset-password/:access_token',asyncHandler(async function(req,res){
  const { access_token } = req.params;
  res.render('auth/forgot-password', {
    status: 'reset',
    access_token
  });
}));
router.post('/reset-password',asyncHandler(async function(req,res){
  const { password, confirm_password, access_token } = req.body;
  if(password == '' || confirm_password == '') return res.render('auth/forgot-password', { access_token, status: 'reset', message: "Vui lòng nhập mật khẩu" });
  if(password != confirm_password) return res.render('auth/forgot-password', { access_token, status: 'reset', message: "Mật khẩu và mật khẩu nhập lại không khớp" });
  const result = JWT.verify(access_token, process.env.ACTIVATION_TOKEN_SECRET);
  const found = await User.findByUsername(result.email);
  if(!found) return res.render('auth/forgot-password', { access_token, status: 'reset', message: "Email không tồn tại" });
  const hash = bcrypt.hashSync(password, 10);
  await User.update({
    Password: hash
  }, {
   where: {
     id: found.id
   }
  }).then(user=> {
   return res.render('auth/forgot-password', {
      status: 'success',
    });
  });
}));
/**
 * @register
 */
 router.get('/register', function (req, res) {
    res.render('auth/register');
  });
router.post('/register', asyncHandler(async function (req, res) {
    const {phonenumber, email, username, password, repassword } = req.body;
    var errors = [];
    if( !email || !username || !password || !repassword||!phonenumber){
      errors.push('Các mục không được để trống :(' );
    }
    if(password !== repassword){
      errors.push('Mật khẩu và mật khẩu được nhập lại không khớp :(');
    }
    if(errors.length > 0){
      res.render('auth/register',
      {
        errors: errors,
        values: req.body
      });
    }
    else{
      const found = await User.findByUsername(email);
  
      if(found){
        errors.push('Email đã tồn tại :(');
        res.render('auth/register', {
          errors: errors,
          values: req.body
        });
      }
      else
      {
        const hash = bcrypt.hashSync(password, 10);
  
        // var addNewUser = await User.add(name, email, username, hash);
        const addNewUser = {
          email:email,
          phonenumber:phonenumber,
          username:username,
          hash:hash
        };
  
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, 
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });
  
        const min = 1000000;
        const max = 10000000;
        const code = Math.floor(Math.random() * (max - min + 1)) + min;
  
        const info = await transporter.sendMail({
          from:  process.env.EMAIL,
          to: addNewUser.email,
          subject: "Đăng ký tài khoản",
          html: `Bạn cần phải làm thêm một bước nữa mới có thể tạo tài khoản để đăng nhập! <br> Mã xác nhận tài khoản: <b>${code}</b>`
        });
  
          //req.flash('success_msg', 'Đăng ký thành công :)');
        res.render('confirm',{code, addNewUser }); //,{ code, addNewUser }
      }
    }
  }));
/**
 * @upadate
 */
router.get('/updateProfile',function(req,res)
{
  res.render('auth/updateProfile');
});
router.post('/updateProfile',async function(req,res){
  const {userId} = req.session;
  const {username,PhoneNumber,email}=req.body;
  const users=await User.findOne({
    attributes:['Email','PhoneNumber','username'],
    where:{
      id:userId
    },
  });
  const found=await User.findByUsername(email);
  /* if(found){
    errors.push('Email đã tồn tại :(');
    res.render('auth/updateProfile', {
      errors:errors,
      values: req.body
    });
  }
  else
  { */
    await User.update({
      username:username,
      Email:email,
      PhoneNumber:PhoneNumber
    }, {
     where: {
       id: userId
     }
   }).then(user=> {
   res.render('auth/updateProfile');
    });
  //} 
});

/**
 * @change_password
 */
router.get('/change-password',function(req,res){
  res.render('auth/change-password');
});
// thay doi mat khau
router.post('/change-password',asyncHandler( async function(req,res){
  
  const{old_password,new_password,confirm_password}=req.body;
  const{userId}=req.session;
  var errors = [];
  if(new_password!==confirm_password)
  {
    errors.push('Mat khau khong trung khop');
    res.render('auth/change-password',{
      errors:errors,
      values:req.body
    })
  }
  if(errors.length > 0){
    res.render('auth/change-password',
    {
      errors: errors,
      values: req.body
    });
  }
  await User.findOne({
    where:{
      id:userId
    }
  }).then(user=>{
    
    if(user){
      bcrypt.compare(old_password,user.Password).then(compare =>{
        if (compare) {
          //update password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(new_password, salt, (err, hash) => {
              User.update({
                Password: hash,
              }, {
                where: {
                  id: userId
                }
              }).then(user => {
                errors.push('Cập nhật mật khẩu thành công');
                return res.render('auth/change-password',{
                  errors:errors,
                  values:req.body
                })
              })

            })
          })
        } else {
          errors.push('Mật Khẩu Cũ Không Đúng');
          return res.render('auth/change-password', {
            errors:errors,
            values:req.body
          })
        }
      })
    }
    else {
      errors.push('Người dùng không tồn tại');
      return res.render('auth/change-password', {
        errors:errors,
        values:req.body
      })
    }

  });
}));


const createAccessToken = (payload) => {
  return JWT.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '15m' })
};

module.exports = router;

