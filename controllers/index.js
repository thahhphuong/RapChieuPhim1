const express = require("express");
const Phim=require('../models/Phim');
const moment= require("moment");

const router = express.Router();

router.use('/auth', require(__dirname + '/auth'));
/* router.use('/admin', require(__dirname + '/admin')); */
router.get('/',async function(req,res)
{
    // ngay them phim
    const phim=await Phim.findAll({
        limit:5,
          //giam dan
        order: [
            ['createdAt', 'ASC']
          ]
    });
    //ngay cong chieu
    
     res.render('index', {phim, moment});
});


module.exports=router;