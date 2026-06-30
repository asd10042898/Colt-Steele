const Review = require('../models/review');
const Campground= require("../models/campground");

// create review controller
module.exports.createReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // 這裡會把目前登入的用戶的 _id 存到 review 的 author 欄位裡面，這樣我們就知道這個 review 是誰創建的了
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// delete review controller
module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // 把這個 reviewId 從 campground 的 reviews 陣列移除
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review!');
    res.redirect(`/campgrounds/${id}`); // 刪除後重定向回該 campground 的詳細頁面   
}