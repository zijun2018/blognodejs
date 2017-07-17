var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/home/index');
var user = require('./routes/admin/user');
//require user defined module posts.js
var posts = require('./routes/home/posts');
var cats = require('./routes/admin/cats');
var article = require('./routes/admin/posts');
var admin = require('./routes/admin/index');
//require session middleware
const session = require('express-session');

var app = express();

//use session middleware
app.use(session({
  secret:'myblog',
  resave:false,
  saveUninitialized:true,
  cookie:{},
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置将.html文件作为模板文件
app.engine('html',require('ejs').__express);
app.set('view engine','html');
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', index);
//For posts request,give posts middleware handwork
app.use('/posts',posts);
//针对后台首页的请求
app.use('/admin',checkLogin);
app.use('/admin',admin);
//针对/admin/cats的请求，交给cats中间件处理
app.use('/admin/cats',cats);
//针对admin/posts的请求，交给article来处理
app.use('/admin/posts',article);
//针对/admin/user/*的请求，交给user来处理，此处不要使用checkLogin
app.use('/user', user);
// catch 404 and forward to error handler


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//自定义一个中间件，用于判断用户是否已经登录
function checkLogin(req,res,next) {
    //只需要判断session中是否有登录的标识
    if(!req.session.isLogin){
        //没有登录，跳转到登录页面
        res.redirect('/user/login');return;
    }
        //否则就是已经登录，继续执行后续的代码
        next();
}
module.exports = app;
