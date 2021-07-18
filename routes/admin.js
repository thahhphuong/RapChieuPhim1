const express = require("express");
const Phim=require('../models/Phim');
const User=require('../models/user');
const DatCho=require('../models/DatCho');
const Rap=require('../models/Rap');
const CumRap=require('../models/CumRap');
const Ve=require('../models/Ve');
const SuatChieu=require('../models/SuatChieu');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.get('/',async function(req,res){
        const {userId}=req.session;
        if(!userId){
            return res.redirect('/');
        }
        else{
            const user=await User.findOne({
                where:{
                    id:userId
                }
            }).then(user=>{
                if(user){
                    if(user.UserType==1){
                        return res.render('admin/index');
                    }
                }
            });
            res.render('/');
        }
})


router.get('/phim', async function (req, res, next) {
    const userid = req.session.userId;
    if (!userid) {
      res.redirect('/');
    } else {
      const user = await User.findOne({
        where: {
          id: userid,
        }
      }).then(user => {
        if (user) {
          if ( user.UserType == 1) {
            Phim.findAll().then(function (phims) {
             return res.render('admin/dashboard/phim', {phims});
            }).catch(next);
          } else {
            res.redirect('/');
          }
        }
      });
    }
  });
router.get('/rap',async function(req,res,next){
  const userId=req.session.userId;
  if (!userId) {
    res.redirect('/');
  } else{
    const user=await User.findOne({
      where:{
        id:userId
      }
    }).then(user=>{
      if(user)
      {
        if(user.UserType==1)
        {
          Rap.findAll().then(function (raps){
            return res.render('admin/dashboard/rap',{raps});
          }).catch(next);
        }else{
          res.redirect('/');
        }
      }
    })
  }
});
router.get('/cumrap',async function(req,res,next){
  const userId=req.session.userId;
  if (!userId) {
    res.redirect('/');
  } else{
    const user=await User.findOne({
      where:{
        id:userId
      }
    }).then(user=>{
      if(user)
      {
        if(user.UserType==1)
        {
          CumRap.findAll().then(function (cumraps){
            return res.render('admin/dashboard/cumrap',{cumraps});
          }).catch(next);
        }else{
          res.redirect('/');
        }
      }
    })
  }
});
router.get('/suatchieu',async function(req,res,next){
  const userId=req.session.userId;
  if (!userId) {
    res.redirect('/');
  } else{
    const user=await User.findOne({
      where:{
        id:userId
      }
    }).then(user=>{
      if(user)
      {
        if(user.UserType==1)
        {
          SuatChieu.findAll().then(function (suatchieus){
            return res.render('admin/dashboard/suatchieu',{suatchieus});
          }).catch(next);
        }else{
          res.redirect('/');
        }
      }
    })
  }
});

/**
 * @them_phim
 */
router.get('/insertphim',async function(req,res){
  const userId=req.session.userId;
  if (!userId ) {
    res.redirect('/');
  } else {
    const user = await User.findOne({
      where: {
        id: userId,
      }
    }).then(user => {
      if (user) {
        if (user.UserType ==1) {
          return  res.render('insert/insertphim');
        } else {
          return res.redirect('/');
        }
      }
    });
  }
});

router.get('/insertrap', async function (req, res) {
  const userId = req.session.userId
  if (!userId) {
    res.redirect('/');
  } else {
    const user = await User.findOne({
      where: {
        id: userId,
      }
    }).then(user => {
      if (user) {
        if (user.UserType ==1) {
          res.render('insert/insertrap');
        } else {
          res.redirect('/');
        }
      }
    });
  }
});
router.get('/insertcumrap', async function (req, res) {
  const userId = req.session.userId
  if (!userId) {
    res.redirect('/');
  } else {
    const user = await User.findOne({
      where: {
        id: userId,
      }
    }).then(user => {
      if (user) {
        if (user.UserType ==1) {
          res.render('insert/insertcumrap');
        } else {
          res.redirect('/');
        }
      }
    });
  }
});
router.get('/insertsuatchieu',async function(req,res){
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/');
  } else {
    const user = await User.findOne({
      where: {
        id: userId,
      }
    }).then(user => {
      if (user) {
        if (user.UserType ==1) {
          res.render('insert/insertsuatchieu');
        } else {
          res.redirect('/');
          }
      }
    });
  }
});
router.get('/index',async function(req,res){
  res.render('admin/index');
});
router.get('/phim', async function(req,res){
  res.render('admin/dashboard/phim');
});
router.get('/rap',async function(req,res){
  res.render('admin/dashboard/rap');
});
router.get('/cumrap',async function(req,res){
  res.render('admin/dashboard/cumrap');
});
router.get('/suatchieu',async function(req,res){
  res.render('admin/dashboard/suatchieu');
});
router.get('/logout', async function (req, res) {
  delete req.session.userId
  res.redirect("/")
});
module.exports=router;