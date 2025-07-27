const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connect Open!!!")
    })
    .catch(err => {
        console.log("Oh no get error")
        console.log(err)
    })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive"]
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        },
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})

// productSchema.methods.greet = function () {
//     console.log("HELLO!!!!!")
//     console.log(`- from ${this.name}`)
// }

productSchema.methods.toggleOnsale = function () {
    this.onSale = !this.onSale;
    return this.save(); //為了回傳 .save() 的 Promise 結果讓外部可以 await 這個方法，知道它什麼時候儲存完成。
}

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
}

productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 })
}

const Product = mongoose.model('Product', productSchema)

const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: "Mountain Bike" }); //Product.findOne() 是一個「非同步操作（async operation）」因為它要去資料庫（MongoDB）查資料，而資料庫存取是「需要時間的」所以需要 await
    console.log(foundProduct);
    await foundProduct.toggleOnsale();
    console.log(foundProduct);
    await foundProduct.addCategory('Outdoors');
    console.log(foundProduct)
}

Product.fireSale().then(res => console.log(res))



// findProduct();

// const bike = new Product({ name: 'Cycling Jersy', price: 27.50 , categories: ['Cycling'], size: 'S' })
// bike.save()
//     .then(data => {
//         console.log("IT WORKED");
//         console.log(data);
//     })
//     .catch(err => {
//         console.log("OH NO ERROR");
//         console.log(err);
//     })

// Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: 100 }, { new: true, runValidators: true }
// )
//     .then(data => {
//         console.log("IT WORKED");
//         console.log(data);
//     })
//     .catch(err => {
//         console.log("OH NO ERROR");
//         console.log(err);
//     })