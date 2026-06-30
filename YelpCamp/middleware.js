const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

// Campground 的 Joi Validate middleware, 用來驗證從表單提交過來的資料是否符合我們定義的 schema，如果不符合就會丟出一個 ExpressError，並且把錯誤訊息傳給前端
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(','); //這段是用來對 details 裡的每個元素拿他的 message 做處理，然後用逗號串起來組成一個新的陣列
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// Review 的 Joi Validate function
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(','); //這段是用來對 details 裡的每個元素拿他的 message 做處理，然後用逗號串起來組成一個新的陣列
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}




// 確認是否 登入的 middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // 這行會把當前請求的 URL 存到 session 中，這樣在用戶登入後就可以重定向回這個 URL 了。
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

// Campground authorization 的 middleware
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    // 這裡要先找到這個 campground，然後檢查目前登入的用戶是不是這個 campground 的作者，如果不是的話就不能讓他編輯
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// Review authorization 的 middleware
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// 用來將當前頁面的 URL 存到 session 中的 middleware，這樣在用戶登入後就可以重定向回這個 URL 了。
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; // 這行會把 session 中的 returnTo 設置為 res.locals.returnTo，這樣在 EJS 模板中就可以直接使用 returnTo 來訪問之前存的 URL 了。
    }
    next();
}