"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const formidable = require('formidable');
require('../../models');
let client = mongoose.model('client');

/* 显示用户登录页面 */
router.get('/login', function(req, res, next) {
    if (req.session.isLogin) {
        res.redirect('/admin');
    }else {
        res.render('admin/login');
    }
});

/* 验证用户登录 */
router.post('/checkLogin',function (req,res,next) {
    //获取用户提交的用户名和密码
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){return false;}
        //连接数据库进行比较
        client.find({'username':fields.username,'password':fields.password}).exec((err,result)=>{
            console.log(result);
            if (result.length) {
                req.session.isLogin = 1;
                res.redirect("/admin");
            }else {
                res.redirect('/user/login');
            }
        });
    });
});
/* 用户注册显示页面 */
router.get('/signin',function (req,res,next) {
    if (req.session.isLogin) {
        res.redirect('/admin');
    }else {
        res.render('admin/signin');
    }
});
/* 用户注册提交(ajax) */
router.post('/signin',function (req,res,next) {
    //获取用户提交的用户名和密码
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){return false;}
        //连接数据库进行比较
        console.log(fields);
        console.log(fields.username+'123');
        console.log(fields.password+'789');
        let newUser = new client({
            username:fields.username,
            password:fields.password,
        });
        client.find({'username' : fields.username}).exec((err,result)=>{
            if (result.length) {
                res.type('.html');
                res.json({'status':-1});
            }else {
                newUser.save(function (err) {
                    res.type('.html');
                    res.json({"status":1});
                });
            }
        });

    });
});

/* 用户登出 */
router.get('/logout',function (req,res,next) {
    req.session.destroy();
    res.redirect('/user/login');
});
module.exports = router;

