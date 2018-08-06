var Board = require('../models/board');
var express = require('express');
var router = express.Router();
var util     = require('../util');
var User     = require('../models/user');
var mongoose=require('mongoose');

//전체보기.
router.get('/',util.isLoggedin,function(req,res,next){
  Board.find({})
  .sort({created_at:-1})
  .exec(function(err,boards){
    res.json(err||!boards? util.successFalse(err):util.successTrue(boards));
  });
});


//게시물 작성하기

router.post('/',util.isLoggedin,function(req,res,next){
  var newBoard = new Board(req.body);
  newBoard.save(function(err,board){

    res.json(err||!board? util.successFalse(err):util.successTrue(board));
  });
});
module.exports = router;

//자기가 쓴 글 보여주기

router.get('/:user_id', util.isLoggedin, function(req,res,next){
  Board.find({user_id:req.params.user_id})
  .exec(function(err,user){
    res.json(err||!user? util.successFalse(err): util.successTrue(user));
  });
});


//수정하기
router.put('/:user_id', util.isLoggedin,function(req,res,next){
  req.body.updated_at =Date.now();
  Board.findOneAndUpdate({user_id:req.params.user_id},req.body,function(err,board){
    if(err||!board) return res.json(util.successFalse(err));

    return res.json(util.successTrue(board));
});
});

//게시글 삭제하기

router.delete('/:user_id', util.isLoggedin,function(req,res,next){
  Board.findOneAndRemove({user_id:req.params.user_id},req.body,function(err,board){
    if(err||!board) return res.json(util.successFalse(err));
    return res.json(util.successTrue(board));
});
});
//구별로 보여주기.
router.get('/:gu',util.isLoggedin, function(req,res,next){
 Board.find({gu:req.params.gu})
 .sort({created_at:-1})
 .exec(function(err,boards){
   res.json(err||!boards? util.successFalse(err):util.successTrue(boards));
 });
});

//세시간 간격으로 보여주기.
router.get('/main',util.isLoggedin,function(req,res,next){
 Board.find({
   created_at : {
     $gte: new Date(new Date().getDate(new Date().getHours()-3)),
     $lt: new Date()
   }})
 .sort({created_at:-1})
 .exec(function(err,boards){
   res.json(err||!boards? util.successFalse(err):util.successTrue(boards));
 });
 });
