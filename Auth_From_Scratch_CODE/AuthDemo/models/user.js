// 做一個有關 User 的 model，裡面有 username 和 password，並都是 required 的欄位


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})



// 在 userSchema 上定義一個靜態方法 findAndValidate，這個方法會接受 username 和 password 作為參數，
// 然後在資料庫中尋找對應的使用者，如果找到的話就使用 bcrypt.compare 來比較密碼是否正確，
// 如果正確就回傳該使用者物件，否則回傳 false。
userSchema.statics.findAndValidate = async function (username, password)  {
    const foundUser = await this.findOne({ username });
    if (!foundUser) {
        return false;
    }
    const validPassword = await bcrypt.compare(password, foundUser.password);
    return validPassword ? foundUser : false;
}


// 在 userSchema 上定義一個 pre save 的 middleware，這個 middleware 會在每次儲存使用者之前執行，
// 如果使用者的密碼有被修改過，就會使用 bcrypt.hash 來將密碼加密，然後再儲存到資料庫中。
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return; // 查看 password 是否被修改過
    this.password = await bcrypt.hash(this.password, 12);
});


module.exports = mongoose.model('User', userSchema)


































// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt')

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: [true, 'Username cannot be blank']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password cannot be blank']
//     }
// })

// userSchema.statics.findAndValidate = async function (username, password) {
//     const foundUser = await this.findOne({ username });
//     const isValid = await bcrypt.compare(password, foundUser.password);
//     return isValid ? foundUser : false;
// }

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// })

// module.exports = mongoose.model('User', userSchema);