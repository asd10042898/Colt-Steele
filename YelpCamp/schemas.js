const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// 這段是用來防止 XSS 攻擊的，當使用者在表單中輸入一些 HTML 標籤（例如 <script>）時，這些標籤可能會被瀏覽器解釋為 HTML 代碼，從而導致安全問題。這段程式碼會把這些 HTML 標籤替換掉，從而防止 XSS 攻擊。
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
})

// 這行是用來把 extension 的功能加到 Joi 裡面
const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array() // 這裡是用來處理在 edit campground 的時候刪除圖片的，因為我們在 edit campground 的時候會有一個 checkbox 是用來選擇要刪除哪些圖片的，這個 checkbox 的 name 是 deleteImages[]，所以在後端我們就可以用 req.body.deleteImages 來拿到這個陣列，然後我們就可以根據這個陣列來刪除對應的圖片了
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})