const express=require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const Car=require('../models/car');
const Review = require('../models/review');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')

router.post('/',validateReview,isLoggedIn,catchAsync(async(req,res)=>{
    const car=await Car.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    car.reviews.push(review);
    await review.save();
    await car.save();
    req.flash('success','Created a new review!')
    res.redirect(`/cars/${car._id}`);
}))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Car.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!')
    res.redirect(`/cars/${id}`);
}))

module.exports=router;