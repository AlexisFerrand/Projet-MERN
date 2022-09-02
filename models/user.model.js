const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String, 
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minLength: 6,
        },
        picture: {
            type: String,
            default:"./uploads/profil/random-user.png"
        },
        bio :{
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String] 
        }
        },
        {
            timestamps: true,
        }
    );

//play function before save into DB | Bcrypt mot de passe
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    console.log(user);
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      console.log(auth);
      if (auth) {
        return user;
      }
      throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
  };


const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;