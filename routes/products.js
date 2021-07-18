
const express = require('express');
const Phim = require('../models/Phim');
const Rap = require('../models/Rap');
const CumRap = require('../models/CumRap');
const User = require('../models/user');
const SuatChieu = require('../models/SuatChieu');
const DatCho = require('../models/DatCho');
const picture=require('../middlewares/picture');

const asyncHandler = require('express-async-handler');
/* const upload = require('../upload/upload'); */
const multer  = require('multer');
const {promisify}=require('util');
const upload = multer({ storage: multer.memoryStorage() });
const rename = promisify(require('fs').rename);
const router = express.Router();

/**
 * @xoa_phim
 */
router.use('/movies/picture/:id',picture);
router.post('/insertphim',upload.single('Poster'),asyncHandler(async function (req, res){
  //const{Ten,NgayCongChieu,ThoiLuong,Poster}=req.body;
    const phim=await Phim.create({
      Ten:req.body.Ten,
      NgayCongChieu:req.body.NgayCongChieu,
      ThoiLuong:req.body.ThoiLuong,
      Poster:req.file
    });  
  res.redirect('/admin/phim');
}));

router.post('/insertrap', async function (req, res, next) {
    await Rap.create({
      Ten: req.body.TenRap,
      LoaiRap: req.body.LoaiRap,
      KTNgang: req.body.KTNgang,
      KTDoc: req.body.KTDoc,
    });
    res.redirect('/admin/rap');
  });

  
router.post('/insertcumrap', async function (req, res, next) {
  await CumRap.create({
    Ten: req.body.TenCumRap,
    DiaChi:req.body.DiaChi
  });
  res.redirect('/admin/cumrap');
});
router.post('/insertsuatchieu',async function(req,res,next){
  await SuatChieu.create({
    ThoiGianBatDau:req.body.thoigianbatdau,
    ThoiGianKetThuc:req.body.thoigiankethuc,
    GiaVe:req.body.GiaVe,
    PhimId:req.body.phimid,
    RapId:req.body.rapid
  });
  res.redirect('/admin/suatchieu');
});
// xóa 
router.post('/deletephim/:id',async function(req,res,next){
  const{id}=req.params;
  //console.log(req.params);
  await Phim.destroy({
    where:{
       id:id
    }
  });
  res.redirect('/admin/phim');
  next();
});
router.post('/deleterap/:id',async function(req,res,next){
  const {id}=req.params;
  await Rap.destroy({
    where:{
      id:id
    }
  });
  res.redirect('/admin/rap');
  next();
});

router.post('/deletecumrap/:id',async function (req,res,next){
  const {id}=req.params;
  await CumRap.destroy({
    where:{
      id:id
    }
  });
  res.redirect('/admin/cumrap');
  next();
});

router.post('/deletesuatchieu/:id',async function(req,res,next){
  const{id}=req.params;
  await SuatChieu.destroy({
    where:{
      id:id
    }
  });
  res.redirect('/admin/suatchieu');
  next();
});



module.exports=router;