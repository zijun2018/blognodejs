const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../../models');
let cats = mongoose.model('cats');
let articles = mongoose.model('articles');

/* GET home page. */
router.get('/', function(req, res, next) {
  cats.find().exec((err,result1)=>{
    if (err) throw err;
    articles.find().exec((err,result2)=>{
      if(err) throw err;
      res.render('home/index',{title:'test blog',cats:result1,posts:result2});
    });
  });
});

module.exports = router;
