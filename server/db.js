const mongoose = require('mongoose');

const url = "mongodb+srv://pardhuvuppala890:722suAiSBjWZL5xm@secretfile.5w17r.mongodb.net/?retryWrites=true&w=majority&appName=SecretFile"

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('NODEJS TO MongoDB Connection ESTABLISHED.....');
  })
  .catch(err => {
    console.error('Error in DB connection:', err.message);
    process.exit(1); 
  });

module.exports = mongoose;



