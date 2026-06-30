const User = require('../models/user');

// register middleware
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}


module.exports.createUser = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username }); // 因為 plugin 預設 username = 必填，所以這裡需要輸入 username
        const userRegister = await User.register(user, password); // 這裡會呼叫 plugin 的 register 方法，會自動幫我們把 password 加密，並且存到資料庫裡面
        req.login(userRegister, err => { // 這裡會呼叫 Passport 的 login 方法，會自動幫我們把 userRegister 的資訊存到 session 裡面，讓我們在後續的請求中都能夠訪問到 req.user
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');    
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}


// login controller
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}


module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // 這裡會從 session 中取出之前存的 returnTo，如果沒有就預設為 /campgrounds
    // delete req.session.returnTo; // 這行會刪除 session 中的 returnTo，因為我們已經用完了，不需要再保留了
    res.redirect(redirectUrl);
}


// logout controller
module.exports.logoutUser = (req, res) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    })
}