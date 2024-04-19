const bcrypt = require('bcrypt');

const hashPassword = async(password) => {
    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
}

const login = async(password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) { console.log('Login was successfully.'); }
    else { console.log('Incorrect password.'); }
}

// hashPassword('surabaya2024');
// login('surabaya2024', '$2b$12$vfXDtinixdi03hDwh4w9geJJsHLbRljFBDyYPV4NsX.q1myv1QWKK');