const asyncHandler = require('express-async-handler');
const ensureLoggedIn = require('../middlewares/ensure-logged-in');
const express =  require('express');
const router = express.Router();

const User = require('../models/user');
const e = require('express');

router.post('/', asyncHandler(async function(req, res){
  const {codeInput, code, phonenumber, email, username, hash} = req.body;
  if(codeInput == code){
    await User.add(phonenumber, email, username, hash);
    res.redirect('auth/login');
  }
  else{
    req.flash('error_msg','Mã xác nhận không chính xác');
  }
}));

module.exports = router;
