
const ExpressError=require('./utils/ExpressError');
const {carSchema,reviewSchema}=require('./schemas.js');
const Car=require('./models/car');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //console.log(req.path, req.originalUrl);
        req.session.returnTo= req.originalUrl;
        req.flash('error','You must be signed in!')
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCar=(req,res,next)=>{
    const {error}= carSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const car=await Car.findById(id);
    if(!car.author.equals(req.user._id)){
        req.flash('error','You donot have the permission to do that!');
        return res.redirect(`/cars/${id}`);
    }next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You donot have the permission to do that!');
        return res.redirect(`/cars/${id}`);
    }next();
}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}