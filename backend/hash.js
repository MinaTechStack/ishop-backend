const bcrypt = require('bcrypt');

const plainPassword = '123'; // 🔁 Replace with your real password

bcrypt.hash(plainPassword, 10, function(err, hash) {
  if (err) {
    console.error("Hashing error:", err);
  } else {
    console.log("Hashed password:", hash);
  }
});
