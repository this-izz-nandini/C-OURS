const cloudinary=require('cloudinary').v2;
const { CloudinaryStorage } =require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'CarsMgr',
        allowedFormats:['jpeg','png','jpg','avif'],
        transformation: [
            { width: 630, height:400, crop: 'limit' }  // Resize to 200px wide while maintaining aspect ratio
          ]
    }
});
module.exports={cloudinary,storage}