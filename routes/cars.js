const express=require('express');
const router= express.Router();
const catchAsync=require('../utils/catchAsync');
const Car=require('../models/car');
const {isLoggedIn,isAuthor,validateCar}=require('../middleware');
const {storage}=require('../cloudinary');
const multer  = require('multer');
const upload = multer({ storage });
const {cloudinary}=require('../cloudinary')
//2 methods- fwd and bwd but we need only fwd

router.get('/',catchAsync(async(req,res)=>{
    const cars=await Car.find({});
    res.render('cars/index',{cars});
}))
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('cars/new');
    //console.log(req.body)
})
router.post('/',isLoggedIn,upload.array('image'),validateCar,catchAsync(async(req,res,next)=>{
    //if(!req.body.car) throw new ExpressError('Invalid car data',400);
    const car=new Car(req.body.car);
    car.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.author=req.user._id;
    await car.save();
    //console.log(car);
    req.flash('success','Successfully made a new car!')
    res.redirect(`/cars/${car._id}`);
    //console.log(req.body,req.files)
}))

router.get('/search', catchAsync(async (req, res) => {
    const { tag } = req.query;
    // console.log(tag);
    if (!tag || tag.trim() === '') {
        req.flash('error','Search query cannot be empty.!');
        return res.redirect('/cars');
    }
    try{
    const cars = await Car.find({
        $or: [
            { title: { $regex: tag, $options: 'i' } },
            { description: { $regex: tag, $options: 'i' } },
            { company: { $regex: tag, $options: 'i' } }
        ]
    });
    if(!cars || cars.length === 0) {
        req.flash('error','Server error while searching for cars.');
        console.error(err);
        return res.redirect('/cars');
    }
    res.render('cars/index',{cars});
    } catch(err){
        req.flash('error', 'An error occurred while searching for cars.');
        console.error(err);
        res.redirect('/cars');
    }
}));
//upload.single() for multiple inputs 

router.get('/:id',catchAsync(async(req,res)=>{
    const car=await Car.findById(req.params.id)
    .populate({path:'reviews', populate:{path:'author'}})
    .populate('author');
    //console.log(car)
    if(!car){ 
        req.flash('error','Car not found!');
        return res.redirect('/cars');
    };
    res.render('cars/show',{car});
}))
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const car=await Car.findById(req.params.id);
    if(!car){ 
        req.flash('error','Car not found!');
        return res.redirect('/cars');
    };
    res.render('cars/edit',{car});
}))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCar,catchAsync(async(req,res)=>{
    const {id}= req.params;
    //console.log(req.body);
    const car=await Car.findByIdAndUpdate(id,{...req.body.car});
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
    car.images.push(...imgs);
    await car.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);}
        await car.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        //console.log(car)
    }
    req.flash('success','Successfully updated car!')
    res.redirect(`/cars/${car._id}`);
}))
router.delete('/:id',isLoggedIn,catchAsync(async(req,res)=>{
    const {id}= req.params;
    await Car.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the car!')
    res.redirect('/cars');
}))

module.exports=router;