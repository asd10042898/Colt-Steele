const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // 確保 email 是唯一的， unique = DB 幫你防重複（但不會幫你提前驗證
    }
});

UserSchema.plugin(passportLocalMongoose.default); // 這行會自動幫我們在 UserSchema 上添加 username 和 password 的欄位，並且還會添加一些方法來處理密碼的雜湊和驗證。

module.exports = mongoose.model('User', UserSchema);