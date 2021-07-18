const User = require('../models/user');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async function auth(req, res, next) {
  const { userId } = req.session;
  res.locals.currentUser = null;
  if(userId){
      const user = await User.findById(userId)
      if(user){
        req.currentUser = user;
        res.locals.currentUser = user;
      }
      next();
  }
  else{
    next();
  }
});
  