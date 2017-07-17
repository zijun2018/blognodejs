
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const formidable = require('formidable');
require('../../models');
let cats = mongoose.model('cats');
const ObjectId = require('objectid');
//所有以/admin/cats打头的路由，都会网这走
//凡是cats后面的/的内容，可以再次进行路由处理
// /admin/cats 交给/
// /admin/cats/add 交给/add
// /admin/cats/edit 交给/edit
/* 访问后台分类显示页面 */
router.get('/',function (req,res,next) {
    //res.render('posts',{title:'my blog'});
    // res.send('显示分类');
    // res.render('admin/category_list');
    cats.find({}).sort({'sort':1}).exec(function (err,data) {
        if(err){next();return false;}
        res.render('admin/category_list',{data});
    });
});

/* 后台分类添加页面 */
router.get('/add',function (req,res,next) {
    // res.send('显示添加分类的表单页面');
    res.render('admin/category_add');
});

/* 完成后台分类添加动作 */
router.post('/insert',function (req,res,next) {
    // res.send('完成添加分类动作');
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        let newData = new cats({
            title : fields.title,
            sort : fields.sort,
        });
        newData.save(function (err) {
            if (err) {
                res.render('admin/message',{message:"添加分类失败"});
            }else {
                res.render('admin/message',{message:"添加分类成功"});
            }
        });
    });
});
/* 删除分类 */
router.get('/delete',(req,res)=>{
    let id = req.query.id;
    cats.remove({_id:ObjectId(id)},(err,result)=>{
        if(err){
            res.render('admin/message',{message:'删除失败'});
        }else {
            res.render('admin/message',{message:'删除成功'});
        }
    });
});

/* 显示编辑后边分类的表单页面*/
router.get('/edit',function (req,res,next) {
    // res.send('显示后台分类编辑的表单页面');
    let id = req.query.id;
    cats.find({_id:ObjectId(id)}).exec((err,result)=>{
     if(err) throw err;console.log(err);
        res.render('admin/category_edit',{cat:result[0]});
    });
});


router.post('/update',(req,res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        cats.update({_id:ObjectId(fields.id)},{title:fields.title,sort:fields.sort},(err,result)=>{
            if(err){
                res.render('admin/message',{message:'更新失败'});
            }else {
                res.render('admin/message',{message:'更新成功'});
            }
        });
    });
});
module.exports = router;