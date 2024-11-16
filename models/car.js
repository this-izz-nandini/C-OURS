const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const imageSchema = new Schema({
    url: String,
    filename: String
});
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts={toJSON: { virtuals: true }};
const carSchema= new Schema({
    title:String,
    images:[imageSchema],
    price:Number,
    description:String,
    company:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);
carSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href='/cars/${this._id}'>${this.title}</a></strong>
    <p>${this.comapny}</p>`;
});
module.exports= mongoose.model('Car',carSchema);