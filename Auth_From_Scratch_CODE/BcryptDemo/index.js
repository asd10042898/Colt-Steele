const bcrypt = require('bcrypt');

const hashPassword = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt)
    console.log(salt)
    console.log(hash)
}




const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw)
    if (result) {
        console.log("LOGGED YOU IN! SUCCESSFUL MATCH!")
    } else {
        console.log("INCORRECT!")
    }
}

login('monkey', '$2b$10$Ii20XVM.zrYP/N7Wz74Sbeuz1lQeUjmBOuZ2Pt6kxNxADafDkLMNW')

// const hashPassword = async (pw) => {
//     //Pass in the plain text password and the number of rounds:
//     const hash = await bcrypt.hash(pw, 12);
//     console.log(hash);
// }

// const login = async (pw, hashedPw) => {
//     const result = await bcrypt.compare(pw, hashedPw);
//     if (result) {
//         console.log("LOGGED YOU IN! SUCCESSFUL MATCH!")
//     } else {
//         console.log("INCORRECT!")
//     }
// }

// hashPassword('monkey');
// login('monkey', '$2b$12$YS9GdWUznoM7r1522knuY.1dq1taWra5zgG7N1WzHs4j.fridopWS')