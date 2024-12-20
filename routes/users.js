const express=require('express');
const router=express.Router();
const catchAsync= require('../utils/catchAsync');
const User=require('../models/user');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register')
})
router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
    req.flash('success','Welcome to C-OURS!');
    res.redirect('/cars');
    })
    } catch(e) {
        req.flash('error',e.message);
        res.redirect('register');
    }
}));
router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login',passport.authenticate('local',{
    failureFlash:true, failureRedirect:'/login',
    //failureMessage:true, keepSessionInfo:true
    }),(req,res)=>{
    req.flash('success','welcome back!');
    const redirectUrl=req.session.returnTo || '/cars';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout',(req,res,next)=>{
    req.logout(err=>{
        if(err) return next(err);
    });
    req.flash('success','logged out successfully!')
    res.redirect('/cars');

})
module.exports=router;