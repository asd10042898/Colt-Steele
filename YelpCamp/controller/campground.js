const Campground= require("../models/campground");
const { cloudinary } = require('../cloudinary'); // 這裡是用來刪除圖片的，因為我們在 edit campground 的時候也可以刪除圖片，所以我們需要把這些要刪除的圖片從 Cloudinary 裡面刪除掉，這樣我們就不會在 Cloudinary 裡面留下一堆沒用的圖片了
const maptilerClient = require("@maptiler/client"); // 這裡是用來把地點轉換成經緯度的，因為我們在 create campground 的時候需要把地點轉換成經緯度，這樣我們在顯示 campground 的時候就可以把地圖也顯示出來了
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY; // 這裡是用來設定 MapTiler 的 API key 的，因為我們在 create campground 的時候需要把地點轉換成經緯度，所以我們需要使用 MapTiler 的 API 來完成這個功能，所以我們需要把 MapTiler 的 API key 設定好，這樣我們在 create campground 的時候就可以使用 MapTiler 的 API 來把地點轉換成經緯度了

// campgrounds page controller
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

// create new campground form page controller
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render('campgrounds/new')
}

// create new campground controller
module.exports.createCampground = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    console.log(geoData);
    if (!geoData.features?.length) { // ?.是安全存取，避免 features 是 undefined 時直接報錯
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);    
    const campground = new Campground(req.body.campground);

    // 這裡是用來把地點轉換成經緯度的，因為我們在 create campground 的時候需要把地點轉換成經緯度，這樣我們在顯示 campground 的時候就可以把地圖也顯示出來了，所以我們需要使用 MapTiler 的 API 來完成這個功能，所以我們需要把 MapTiler 的 API key 設定好，這樣我們在 create campground 的時候就可以使用 MapTiler 的 API 來把地點轉換成經緯度了
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    campground.images = req.files.map(f => ({ url:f.path, filename: f.filename})); // 這裡會把上傳的檔案的 url 和 filename 存到 campground 的 images 欄位裡面，這樣我們就可以在顯示 campground 的時候把圖片也顯示出來了
    campground.author = req.user._id; // 這裡會把目前登入的用戶的 _id 存到 campground 的 author 欄位裡面，這樣我們就知道這個 campground 是誰創建的了
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

// campground detail page controller
module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', 
        populate: { // 這裡是用來把 reviews 裡面的 author 欄位也 populate 出來，這樣我們在顯示 review 的時候就可以直接訪問 review.author.username 了 
            path: 'author'
        }
    }).populate('author');
    console.log(JSON.stringify(campground, null, 2)); // 這裡是用來檢查 campground 的資料結構的，因為我們在 campground 裡面有一個 reviews 欄位，這個欄位裡面是一個陣列，裡面存的是 review 的 ObjectId，所以我們需要把這些 ObjectId 都 populate 出來，這樣我們才能在顯示 campground 的時候把 review 的內容也顯示出來
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

// edit campground form page controller
module.exports.editCampgroundPage = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

// edit campground controller
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }
    console.log(req.body)

    // 如果是作者的話就可以讓他編輯，這裡使用了 Mongoose 的 findByIdAndUpdate 方法來更新 campground 的資料，這個方法會直接在資料庫裡面更新資料，不需要先找到這個 campground 再修改再存回去，這樣效率比較高
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    // 這裡是用來處理上傳的圖片的，因為我們在 edit campground 的時候也可以上傳新的圖片，所以我們需要把這些新的圖片的資料存到 campground 的 images 欄位裡面，這樣我們在顯示 campground 的時候就可以把這些新的圖片也顯示出來了
    const imgs = req.files.map(f => ({ url:f.path, filename: f.filename}));
    campground.images.push(...imgs); // 因為imgs 是一個陣列，所以我們需要用 push 的方式把這些圖片的資料都放到 campground 的 images 欄位裡面，這樣我們就可以在顯示 campground 的時候把這些圖片也顯示出來了
    await campground.save();

    // 這裡是用來處理刪除圖片的，因為我們在 edit campground 的時候也可以刪除圖片，所以我們需要把這些要刪除的圖片的 filename 從 campground 的 images 欄位裡面刪除掉，這樣我們在顯示 campground 的時候就不會把這些被刪除的圖片顯示出來了
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // 這裡是用來刪除 Cloudinary 裡面的圖片的，因為我們在 edit campground 的時候也可以刪除圖片，所以我們需要把這些要刪除的圖片從 Cloudinary 裡面刪除掉，這樣我們就不會在 Cloudinary 裡面留下一堆沒用的圖片了
        }
        await campground.updateOne({ $pull: { images: { filename: {$in: req.body.deleteImages}}}})
        console.log(campground);
    }
    
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// delete campground controller
module.exports.deleteCamppground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}