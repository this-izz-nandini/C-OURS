// if(process.env.NODE_ENV!=='production'){
//     require('dotenv').config();
// }
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash = require('connect-flash');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');

const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const userRoutes=require('./routes/users');
const carRoutes=require('./routes/cars');
const reviewRoutes=require('./routes/reviews');

const MongoStore=require('connect-mongo');
const app=express();

const dbUrl = process.env.DB_URL;
const mysecret = process.env.SECRET;

mongoose.connect(dbUrl).then(()=>{
    console.log('Database connected');
}).catch(err=>{
    console.error('Error connecting to database:', err);
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize()); // Sanitize MongoDB queries to prevent injection

const store=new MongoStore({
    mongoUrl:dbUrl,
    secret:mysecret,
    touchAfter: 24*60*60,
    collectionName: 'sessions'
})
store.on('error',function(e){
    console.log('session store error',e)
})
const sessionConfig={
    store,
    name:'session',
    secret:mysecret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({crossOriginEmbedderPolicy:false,contentSecurityPolicy:false}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dcuz2moth/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
})

app.get('/fakeUser',async(req,res)=>{
    const user=new User({email:'abc@gmail.com',username:'xyz'});
    const newUser=await User.register(user,'pw_1234');
    res.send(newUser);
})

app.use('/',userRoutes);
app.use('/cars',carRoutes);
app.use('/cars/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
    res.render('home');
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found!',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='Oh no, something went wrong!'
    res.status(statusCode).render('error',{err})
})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`serve at http://localhost:${port}`);
})