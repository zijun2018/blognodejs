/**
 * Created by Administrator on 2017/6/30.
 */
'use strict';
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://coder:code@localhost:27017/myblog');
db.connection.on('error',(err)=>{
    console.log('Sorry,database connected faild:'+err);
});
db.connection.on('open',(callback)=>{
    console.log('Well,congratuation,database connected success');
});

const catsSchema = new mongoose.Schema({
    title:{type:String},
    sort:{type:Number},
},{versionKey:false});
let cats = mongoose.model('cats',catsSchema);

const articlesSchema = new mongoose.Schema({
    cat : {type:String},
    title : {type:String,default:''},
    summary : {type:String,default:''},
    content : {type:String,default:''},
    cover : {type:String,default:''},
    time : {type:String,default:new Date().toLocaleString()},
    count : {type:Number},
    tag : {type:String,default:''}

},{versionKey:false});
let articles = mongoose.model('articles',articlesSchema);

const clientSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
},{versionKey:false});
let client = mongoose.model('client',clientSchema);