/**
 * Created by Administrator on 2017/6/30.
 */
const express = require('express');
const router = express.Router();


router.get('/',function (req,res,next) {
    res.render('admin/admin');
});

module.exports = router;