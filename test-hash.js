"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
async function testHash() {
    const password = 'Password123!';
    const hashed = await (0, bcrypt_1.hash)(password, 10);
    console.log('Original password:', password);
    console.log('Hashed password:', hashed);
    const matches = await (0, bcrypt_1.compare)(password, hashed);
    console.log('Password matches?', matches);
}
testHash().catch((err) => console.error('Error in testHash:', err));
//# sourceMappingURL=test-hash.js.map