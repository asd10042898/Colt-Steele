const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationshipsDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Mongo connection open');
    })
    .catch(err => {
        console.log('Mongo connection error');
        console.log(err);
    })



// 實體（Entities）
// Course (父)
// title
// description

// Lesson (子)
// title
// videoUrl
// duration
// isPublished
// createdAt

// 規則 & 使用情境
// 一個 Course 會有 5～30 個 Lesson

// Lesson 一定隸屬於某一個 Course

// 使用者最常做的操作是：
// 看「課程列表」（不需要 lesson 詳細內容）
// 進入課程頁 → 分頁載入 lessons

// Lesson 之後可能會：
// 被標記為 draft / published
// 單獨更新（改標題、換影片）

// 未來可能會有：
// Lesson 被「搬到另一個 Course」
// Lesson 被單獨刪除






//     ✍️ 請你做三件事（照順序來）
// ① 判斷關係類型
// 這個關係應該算：
// One To Few
// One To Many
// One To Bajillions
// 👉 選一個，並說理由
// 因為一個 Course 只有 5~30 個 Lesson，沒有 Course 的話 Lesson 就沒有意義了
// Course 為父節點，Lesson 為子節點
// 因此我覺得是 One To Many

// 答案是比較偏向 One To Few



// ② 決定「ObjectId 放哪裡」
// 你會選擇：
// A️⃣ Course 裡面存 lessonIds: []
// B️⃣ Lesson 裡面存 courseId
// C️⃣ 兩邊都存
// D️⃣ 其他（請說明）
// 👉 選一個，並說理由
// 我會選擇 Course 裡面存 lessonIds: []
// 因為一個 Course 裡面只會有 5~30 個 Lesson，對於 MongoDB 來說並不算太多
// 而且使用者會常使用的操作是從 Course 裡面去看 Lesson 的列表
// 所以把 ObjectId 放在 Course 裡面會比較方便查詢


// ③ 寫出你選擇的 Mongoose Schema（重點部分即可）

// const courseSchema = new Schema({
//     title: String,
//     description: String,
//     lessons:[{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
// })

// const lessonSchema = new Schema({
//     title: String,
//     videoUrl: String,
//     duration: Number,
//     isPublished: Boolean,
//     createdAt: Date
// })