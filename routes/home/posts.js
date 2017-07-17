/**
 * Created by Administrator on 2017/6/30.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../../models');
let articles = mongoose.model('articles');
let cats = mongoose.model('cats');
const ObjectId = require('objectid');
/* 访问文章页面 */
router.get('/',function (req,res,next) {
   let id = req.query.id;
   articles.find({_id:ObjectId(id)}).exec((err,result)=>{
      if(err) throw err;
      cats.find().exec((err,result2)=>{
         if(err) throw err;
         console.log(result);
         console.log(result2);
         res.render('home/posts',{data:result,cats:result2});
      });

   });
   // res.render('home/posts',{title:"Express"});
});

module.exports = router;