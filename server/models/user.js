const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String, 
        unique: true
    },
    passwordHash: {
        type: String,
        requited: true
    },
    reputation: {
        type: Number,
        default: 0
    },
    isAdmin : {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.virtual('url').get(function() {
    return '/posts/user/_id';
});

userSchema.statics.findById = async function(userId) {
    try {
        const user = await this.findOne({ _id: userId });
        return user;
    } catch (error) {
        throw new Error(`Error finding user by ID: ${error.message}`);
    }
};

module.exports = mongoose.model('User', userSchema);