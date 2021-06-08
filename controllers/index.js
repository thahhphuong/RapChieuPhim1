const express = require("express");
const Phim=require('../models/Phim');
const moment= require("moment");

const router = express.Router();

router.use('/auth', require(__dirname + '/auth'));
/* router.use('/admin', require(__dirname + '/admin')); */
router.get('/',async function(req,res)
{
    // ngay them phim
    const phimMoiChieu=await Phim.findAll({
        limit:4,
          //giam dan
        order: [
            ['createdAt', 'ASC']
          ]
    });
    //ngay cong chieu
     const phim=await Phim.findAll({
        limit:4,
        order: [
            //sap xep tang dan
            ['NgayCongChieu', 'DESC']
          ]
     });
     res.render('index', {phimMoiChieu, phim, moment});

});


module.exports=router;