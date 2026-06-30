const express = require('express');
const router = express.Router({ mergeParams: true }); // 這個選項是為了讓 reviews 的路由能夠訪問到 campgrounds 的 id 參數   
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviewController = require('../controller/review');





// create review route 
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))


// delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))


module.exports = router;