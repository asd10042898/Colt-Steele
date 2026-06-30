const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } }; // 這裡是用來設定 virtuals 的，因為我們在 CampgroundSchema 中有定義 virtuals，所以我們需要把這個設定加上去，這樣我們在使用 toJSON 的時候就會把 virtuals 也轉換成 JSON 格式，這樣我們在前端使用的時候就可以直接使用 virtuals 的屬性了。


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_300');
})


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema], // 這裡是用來存放圖片的資料的，因為我們在上傳圖片的時候會把圖片的 url 和 filename 存到這裡面，這樣我們在顯示 campground 的時候就可以把這些圖片也顯示出來了
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts); // 要加上這個才可以使用 virtuals 的功能，這樣我們在使用 toJSON 的時候就會把 virtuals 也轉換成 JSON 格式，這樣我們在前端使用的時候就可以直接使用 virtuals 的屬性了。

// 這段是在 Campground Model 裡定義一個虛擬欄位，用來產生地圖彈出視窗的 HTML 內容。
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const res = await Review.deleteMany({ _id: { $in: doc.reviews} })
        console.log(res)
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);