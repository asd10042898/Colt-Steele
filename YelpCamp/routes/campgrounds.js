const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroundController = require('../controller/campground');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage }); // 這裡的 dest 是 multer 的選項，用來指定上傳的檔案要存放在哪個資料夾，這裡是 uploads 資料夾，當使用者上傳檔案後，multer 會自動把檔案存到這個資料夾裡面，並且在 req.file 或 req.files 裡面提供檔案的相關資訊


// // Campground 的 Joi Validate function
// const validateCampground = (req, res, next) => {
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(','); //這段是用來對 details 裡的每個元素拿他的 message 做處理，然後用逗號串起來組成一個新的陣列
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

// // authorization 的 middleware
// const isAuthor = async(req, res, next) => {
//     const { id } = req.params;
//     // 這裡要先找到這個 campground，然後檢查目前登入的用戶是不是這個 campground 的作者，如果不是的話就不能讓他編輯
//     const camp = await Campground.findById(id);
//     if (!camp.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }


router.route('/')
    // campgrounds page route
    .get(catchAsync(campgroundController.index))
    // create new campground  route
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))
    
    
    // .post(upload.array('image'), (req, res) => { // 這裡的 upload.array() 是 multer 的 middleware，用來處理上傳的檔案，'image' 是指前端 form 裡面 input type="file" 的 name，要跟這裡一樣才會正確處理上傳的檔案
    //     console.log({
    //         body: req.body,
    //         file: req.files
    //     });
    //     res.send('It worked!');
    // })


// create new campground form page route
router.get('/new', isLoggedIn, campgroundController.renderNewForm)


router.route('/:id')
    // campground detail page route
    .get(catchAsync(campgroundController.showCampground))
    // edit campground route
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.editCampground))
    // delete campground route
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCamppground))


// edit campground form page route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampgroundPage))



module.exports = router;