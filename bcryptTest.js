const bcrypt = require('bcrypt');

const testBcrypt = async () => {
    const plaintextPassword = 'Yo13 5!';
    const hashedPassword = '$2b$10$IpOSdDk1zOjhZZJ5P45vYugsWGB/u2BNy3B2rDEvZiH7SIhrbIxnS'; // Replace this with your bcrypt-hashed password
  
    try {
      const match = await bcrypt.compare(plaintextPassword, hashedPassword);
      console.log('Password matches:', match);
    } catch (error) {
      console.error('Error comparing passwords:', error);
    }
  };
  
  testBcrypt();

  