const mongoose = require('mongoose');

mongoose
  .connect(
    "mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.aq0zedi.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    }
  )
  .then(() => console.log('Connected to mongoDB'))
  .catch((err) => console.log('Log failed to mongoDB', err));
