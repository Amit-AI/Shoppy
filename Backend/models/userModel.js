const mongoose = require("mongoose");
const validator = require("validator"); //for validating email
const bcrypt = require("bcryptjs"); //for password encryption
const jwt = require("jsonwebtoken"); //token for user login/session

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your e-mail"],
        unique: [true, "User already exists"],
        validate: [validator.isEmail, "Please enter a valid e-mail"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be atleast 8 character long"],
        // select: false, //to not get password in results in api call
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// this is used to hash the password before saving it to DB
userSchema.pre("save", async function (next) {
    //used function keyword, bcoz this keyword doesn't work with arrow function
    if (!this.isModified("password")) {
        //if password is already there, or not changed, no need to hash it again
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//comment
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
