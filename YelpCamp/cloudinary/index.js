// 設定 Cloudinary（帳號連線） + 設定 Multer 的儲存位置（改成雲端）
const cloudinary = require('cloudinary').v2; // 操作雲端圖片（上傳 / 刪除）
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // 讓 Multer 可以直接存到 Cloudinary

// 用你的帳號金鑰登入 Cloudinary, 這些值來自 .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// 告訴 Multer：檔案不要存本地，直接存到 Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp', // 上傳後會出現在：Cloudinary → YelpCamp 資料夾
        allowedFormats: ['jpeg', 'png', 'jpg'] // 限制上傳的檔案格式
    }  
})


module.exports = {
    cloudinary,
    storage
}