const asyncHandler = require('express-async-handler');
const Movies=require('../models/Phim');

module.exports=asyncHandler(async function Picture(req,res,next)
{
    const {id}=req.params;
    const movie=await Movies.findByPicture(id);
    if(!movie)
    {
        res.status(404).send('File not found');
        next();
    }
    else{
        res.header('Content-type','image/jpeg').send(movie.Poster);
        next();
    }
    next();
});