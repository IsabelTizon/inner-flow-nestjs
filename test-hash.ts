import { hash, compare } from 'bcrypt';

async function testHash() {
  const password = 'Password123!';
  const hashed = await hash(password, 10);

  console.log('Original password:', password);
  console.log('Hashed password:', hashed);

  const matches = await compare(password, hashed);
  console.log('Password matches?', matches);
}

testHash().catch((err) => console.error('Error in testHash:', err));
