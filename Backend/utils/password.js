//Password hashing fuction temporary untlin implemented properly
async function firsthashPassword(plainPassword) {
  try {const password = "userPassword123"; //Temp password

// Hash
const hash = await argon2.hash(plainPassword);

// Verify
const valid = await argon2.verify(hash, plainPassword);
console.log(valid); // true
  } catch (err) {
    console.error(err);
  } }

async function hashPassword(plainPassword) {
  return await argon2.hash(plainPassword);
}

async function verifyPassword(hash, plainPassword) {
  return await argon2.verify(hash, plainPassword);
}