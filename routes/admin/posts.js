/**
 * Created by Administrator on 2017/6/30.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const formidable = require('formidable');
const fs = require('fs');
require('../../models');
let cats = mongoose.model('cats');
let articles = mongoose.model('articles');
const ObjectId = require('objectid');

router.get('/',function (req,res,next) {
   // res.send('显示文章');
   //  res.render('admin/article_list');
    articles.find({}).sort({'time':-1}).exec(function (err,data) {
        if(err){next();return false;}
        res.render('admin/article_list',{data:data});
    });
});
/* 添加文章页*/
router.get('/add',function (req,res,next) {
    // res.send('显示添加文章的表单页面');
    // res.render('admin/article_add');
    cats.find().exec((err,result)=>{
        if(err){
            throw err;
        }else {
            res.render('admin/article_add',{cats:result});
        }
    });
});

/* 上传文章*/
router.post('/insert',function (req,res,next) {
   // res.send('完成添加文章动作');
   //  res.render('admin/article_insert');
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = process.cwd()+'/temp/';
    form.parse(req, function(err, fields,files) {
        fs.rename(files.cover.path,process.cwd()+'/uploads/'+files.cover.name);
        let newData = new articles({
            cat : fields.cat,
            title : fields.title,
            summary : fields.summary,
            content : fields.content,
            count : Math.ceil(Math.random()*100),
            tag : fields.tag,
            cover : process.cwd()+'/uploads/'+files.cover.name,
        });
        newData.save(function (err) {
            if (err) {
                res.render('admin/message',{message:"添加文章失败"+err});
            }else {
                res.render('admin/message',{message:"添加文章成功"});
            }
        });
    });
});
/*编辑文章 */
router.get('/edit',function (req,res,next) {
    // res.send('显示后台文章编辑的表单页面');
    // res.render('admin/article_edit');
    let id = req.query.id;
    articles.find({_id:ObjectId(id)}).exec((err,result)=>{
        if(err) throw err;console.log(err);
        res.render('admin/article_edit',{data:result[0]});
    });

});
/* 删除文章 */
router.get('/delete',(req,res)=>{
    let id = req.query.id;
    articles.remove({_id:ObjectId(id)},(err,result)=>{
        if(err){
            res.render('admin/message',{message:'删除失败'});
        }else {
            res.render('admin/message',{message:'删除成功'});
        }
    });
});
/* 更新文章 */
router.post('/update',(req,res)=>{
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = process.cwd()+'/temp/';
    form.parse(req, function(err, fields,files) {
        fs.rename(files.cover.path, process.cwd() + '/uploads/' + files.cover.name);
        articles.update({_id: ObjectId(fields.id)}, {
            cat: fields.cat,
            title: fields.title,
            summary: fields.summary,
            content: fields.content,
            count: Math.ceil(Math.random() * 100),
            tag: fields.tag,
            cover: process.cwd() + '/uploads/' + files.cover.name,
        }, (err, result)=> {
            if (err) {
                res.render('admin/message', {message: '更新失败'});
            } else {
                res.render('admin/message', {message: '更新成功'});
            }
        });
    });
});
module.exports = router;