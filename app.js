const express = require('express');
const bodyParser = require('body-parser');
// const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const multer  = require('multer');
const db = require('./models/database');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authMiddleware = require('./middlewares/auth');
const controllers = require(__dirname+"/controllers");
const productRouter=require('./routes/products');
//const loginRouter = require('./routes/auth/login');
//const registerRouter = require('./routes/auth/register');
const confirmRouter = require('./routes/confirm');
const phimRouter=require('./routes/phim');
const adminRouter=require('./routes/admin.js');
const app = express();

app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'DACK'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.static("public"));
app.use(authMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressLayouts);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


app.use(controllers);

//app.use('/auth', loginRouter);
//app.use('/auth', registerRouter);

app.use('/confirm', confirmRouter);
app.use('/auth',phimRouter);
app.use('/category',phimRouter);
app.use('/admin',adminRouter);
app.use('/insert',productRouter);

/* app.get('/', function (req, res) {
  res.render('index',{ title: 'Trang chủ'});
}); */

db.sync().then(function (){
  const port = process.env.PORT || 3000;
  console.log(`Server is listening on port ${port}`);
  app.listen(port);
}).catch(console.error);
