const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, "Farm must have a name!"]
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Farm must have an email!"]
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})



farmSchema.post('findOneAndDelete', async function (farm) { //farm 代表：剛剛被刪掉的那個 Farm document
    if (farm.products.length) { //確認 farm 的 products 是否有內容
        const res = await Product.deleteMany({ _id: { $in: farm.products } }) //把 _id 在 farm.products 陣列裡的 product 全部刪掉
        console.log(res);
    }   
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;

// farmSchema needs name(re), city, email(re)