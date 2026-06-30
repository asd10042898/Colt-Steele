const express = require('express');
const app = express();
const User = require('./models/user');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


// 連接到 MongoDB 資料庫，資料庫名稱為 loginDemo
mongoose.connect('mongodb://127.0.0.1:27017/loginDemo')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// app.set
app.set('view engine', 'ejs'); // 告訴瀏覽器我們使用 ejs 作為模板引擎
app.set('views', path.join(__dirname, 'views')); // 告訴瀏覽器我們的 views 資料夾在根目錄下的 views 資料夾裡面


// middleware
// 驗證使用者是否已經登入的 middleware
const requiredLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}





// app.use
app.use(express.urlencoded({ extended: true })); // 解析表單資料 (req.body)
const sessionOptions = {
    secret: 'notagoodsecret'
}
app.use(session(sessionOptions)) // 設定 session 的 secret，這個 secret 用來加密 session 資料，應該要放在環境變數裡面


// Home Page Route
app.get('/', (req, res) => {
    res.send('This is the HOME PAGE');
})


// register routes
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
        username: username,
        password: password
    })
    await user.save();
    req.session.user_id = user._id; // 註冊成功後，將使用者的 ID 存入 session 中
    res.redirect('/');
})


// login routes
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser){
        req.session.user_id = foundUser._id; // 登入成功後，將使用者的 ID 存入 session 中
        res.redirect('/secret');
    } else {
        res.redirect('/login')
    }
})



// logout route
app.post('/logout' , (req, res) => {
    req.session.user_id = null; // 登出後，將 session 中的 user_id 設為 null
    res.redirect('/login');
})



app.get('/secret', requiredLogin, (req, res) => {
    // if(!req.session.user_id){
    //     return res.redirect('/login') // 加上 return 是為了避免在重定向後繼續執行下面的程式碼，導致錯誤發生
    // }
    res.render('secret');
})


// 開始使用 3000 port
app.listen(3000, () => {
    console.log('Connect Succecsfully!')
})
































// const express = require('express');
// const app = express();
// const User = require('./models/user');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const session = require('express-session');



// mongoose.connect('mongodb://localhost:27017/loginDemo', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("MONGO CONNECTION OPEN!!!")
//     })
//     .catch(err => {
//         console.log("OH NO MONGO CONNECTION ERROR!!!!")
//         console.log(err)
//     })


// app.set('view engine', 'ejs');
// app.set('views', 'views');

// app.use(express.urlencoded({ extended: true }));
// app.use(session({ secret: 'notagoodsecret' }))

// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }
//     next();
// }
// app.get('/', (req, res) => {
//     res.send('THIS IS THE HOME PAGE')
// })

// app.get('/register', (req, res) => {
//     res.render('register')
// })

// app.post('/register', async (req, res) => {
//     const { password, username } = req.body;
//     const user = new User({ username, password })
//     await user.save();
//     req.session.user_id = user._id;
//     res.redirect('/')
// })

// app.get('/login', (req, res) => {
//     res.render('login')
// })
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const foundUser = await User.findAndValidate(username, password);
//     if (foundUser) {
//         req.session.user_id = foundUser._id;
//         res.redirect('/secret');
//     }
//     else {
//         res.redirect('/login')
//     }
// })

// app.post('/logout', (req, res) => {
//     req.session.user_id = null;
//     // req.session.destroy();
//     res.redirect('/login');
// })

// app.get('/secret', requireLogin, (req, res) => {
//     res.render('secret')
// })
// app.get('/topsecret', requireLogin, (req, res) => {
//     res.send("TOP SECRET!!!")
// })

// app.listen(3000, () => {
//     console.log("SERVING YOUR APP!")
// })

