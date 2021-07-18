const express = require("express");
const Phim=require('../models/Phim');
const User=require('../models/user');
const DatCho=require('../models/DatCho');
const Rap=require('../models/Rap');
const CumRap=require('../models/CumRap');
const Ve=require('../models/Ve');
const SuatChieu=require('../models/SuatChieu');
const picture=require('../middlewares/picture');
const Sequelize = require('sequelize');
const Op=Sequelize.Op;
const moment = require('moment');



const router = express.Router();
/**
 * @hiển_thị_ảnh
 */
router.use('/movies/picture/:id',picture);

/**
 * @hiển_thị_phim
 */
router.get('/phim',async function(req,res,next ){
    const {id}=req.query;
    //const {_phimid}=req.session;
    const phim=await Phim.findAll({
      // attributes:['ThoiGianBatDau','ThoiGianKetThuc'],
        order:[
        ['NgayCongChieu', 'ASC']
        ],
        raw:true
    });

      res.render('category/phim',{phim,moment});
    next();
});

/**
 * @rạp_phim
 */
//cumrap ->rap ->suatchieu
router.get('/rap',async function(req,res){
  const {id} = req.query
  const cumrap = await CumRap.findAll();
  const rap = await Rap.findAll();
  const suatchieu = await SuatChieu.findAll({
    where: {
      PhimId: id
    },
    include: [{
      model: Rap,
      include: [{
        model: CumRap
      }]
    }]
  });
  const suatchieu_ = await SuatChieu.findAll({
    where: {
      PhimId: id
    },
    include: [{
      model: Rap
    }]
  });
  res.render('category/rap', {suatchieu, cumrap, rap, suatchieu_});
});
/**
 * @danh_sách_rạp
 */
router.get('/thongtinrap',async function(req,res,next){
  const {id} = req.query;
  const cumrap=await CumRap.findAll();

  CumRap.findOne({
    where:{
      id:id
    }
  }).then(function (cumraps) {
    res.render('category/thongtinrap', {cumraps,cumrap});
  }).catch(next);
});
/**
 * @suất_chiếu
 */
router.get('/suatchieu',async function(req,res){
  const {id} = req.query
  const cumrap = await CumRap.findAll()
  const rap = await Rap.findAll()
  const suatchieu = await SuatChieu.findAll({
    where: {
      PhimId: id
    },
    include: [{
      model: Rap,
      include: [{
        model: CumRap
      }]
    }]
  });
  const suatchieu__ = await SuatChieu.findAll({
    where: {
      PhimId: id
    },
    include: [{
      model: Rap
    }]
  });
  res.render('category/suatchieu', {suatchieu, cumrap, rap, suatchieu__});
});
/**
 * vé xem phim
 */
router.get('/ve',async function(req,res){
  const {IDRap}=req.query;
  const {IDSuatChieu}=req.query;
  const {userId}=req.session;
  if(!userId){
    return res.redirect('/auth/login');
  }
  await Ve.findAll({
        include:[{
          model:DatCho,
          where:{
            SuatChieuId:IDSuatChieu
          }
        }]
      }).then(ve=>{
        if(ve){
          Rap.findOne({
            //attributes:['Ten'],
            where:{
              id:IDRap
            }
          }).then(rap=>{
            let arr_ghe=[];
            /* ve.map(function(item){
              arr_ghe.push(item.MaGhe)
            }) */
            res.render('category/ve',{ve,rap,userId,arr_ghe,IDSuatChieu});
          })
        }else{
          Rap.findOne({
          where:{
            id:IDRap
          }
        }).then(rap => {
            let arr_ghe = []
          /*   ve.map(item => {
              arr_ghe.push(item.MaGhe)
            }) */
            res.render('category/ghe', {rap, IDSuatChieu, userId, arr_ghe})
          })
        }
      })
});

// đặt ghế

router.post('/dat-cho',function(req,res){
  res.render('cagetory/dat-cho');
});
/**
 * @search
 */
router.get('/search',async function(req,res){
  const {search}=req.query;
  //const {id}=req.params;
  var errors=[];
  //ThoiDiemBatDau=ThoiDiemBatDau.toLowerCase;
  const cumrap = await CumRap.findAll()
  const rap = await Rap.findAll()
  //const phim=await Phim.findAll()
  //Ten=Ten.toLowerCase;
  await SuatChieu.findAll({
      where:{
        ThoiGianBatDau:{[Op.iLike]:'%'+search+'%'},
      },
      include:[{
        model:Phim
      }]
  }).then(gigs=>{
      if(gigs)
      {
        res.render('category/search',{gigs,moment,rap,search});
        //console.log(suatchieu);
      }
      else{
        console.log('err');
      }
    
    })
});
module.exports=router;