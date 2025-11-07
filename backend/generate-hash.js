const bcrypt = require('bcryptjs');

const password = 'Admin@2024!';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);