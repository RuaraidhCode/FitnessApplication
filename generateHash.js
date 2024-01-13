const bcrypt = require('bcrypt');

const plaintextPassword = 'Yo13 5!';
const saltRounds = 10;

bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Bcrypt-hashed password:', hash);
  }
});
