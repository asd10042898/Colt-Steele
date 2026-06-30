// 只在開發環境載入 .env
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');





mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp-maptiler');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// 這個是用來防止 MongoDB 注入攻擊的 middleware，當使用者在表單中輸入一些特殊的字元（例如 $ 或 .）時，這些字元可能會被 MongoDB 解釋為操作符，從而導致安全問題。這個 middleware 會把這些特殊字元替換掉，從而防止 MongoDB 注入攻擊。
app.set('query parser', 'extended');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' })); // 這裡是用來設定 mongoSanitize 的選項的，replaceWith 是用來指定要把特殊字元替換成什麼字元的，這裡我們把它設定成 '_'，這樣當使用者在表單中輸入一些特殊的字元（例如 $ 或 .）時，這些字元就會被替換成 '_'，從而防止 MongoDB 注入攻擊。



// session 和 flash 的設定
const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //防止 XSS 攻擊偷 cookie
        // secure: true, // 這裡是用來設定 cookie 的 secure 屬性的，當 secure 屬性為 true 時，cookie 只能在 HTTPS 連線中傳輸，這樣可以增加 cookie 的安全性，防止 cookie 被竊取。但是在開發環境中，我們通常不會使用 HTTPS，所以我們把 secure 屬性設置為 false，這樣 cookie 就可以在 HTTP 連線中傳輸了。
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 設定「實際過期時間點」
        maxAge: 1000 * 60 * 60 * 24 * 7 //cookie 可以存活 7 天
    }
}
app.use(session(sessionConfig));
app.use(flash());


// Passport 的設定
app.use(passport.initialize()); // 這行會初始化 Passport，讓它能夠在 Express 中使用
app.use(passport.session()); // 這行會讓 Passport 能夠使用 session 來保持用戶的登入狀態
passport.use( new localStrategy(User.authenticate()) ); // 這行會告訴 Passport 使用 Local Strategy 來進行身份驗證，並且使用 User 模型提供的 authenticate 方法來驗證用戶的身份
passport.serializeUser(User.serializeUser()); // 這行會告訴 Passport 如何將用戶的資訊序列化到 session 中，這裡使用 User 模型提供的 serializeUser 方法
passport.deserializeUser(User.deserializeUser()); // 這行會告訴 Passport 如何從 session 中反序列化用戶的資訊，這裡使用 User 模型提供的 deserializeUser 方法


app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user; // 這行會把 req.user（Passport 會自動把登入的用戶資訊存到 req.user）設置為 res.locals.currentUser，這樣在 EJS 模板中就可以直接使用 currentUser 來訪問當前登入的用戶資訊了。
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// Campgrounds routes
app.use('/campgrounds', campgroundsRoutes);






// Reviews routes
app.use('/campgrounds/:id/reviews', reviewsRoutes);





// User routes
app.use('/', usersRoutes);




app.get('/', (req, res) => {
    res.render('home')
})



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})