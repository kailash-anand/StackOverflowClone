const { default: mongoose } = require("mongoose");

// Question Document Schema
const questionSchema = mongoose.Schema({
    title: {
        required: true,
        type: String,
        maxlength: 100
    },
    summary: {
        required: true,
        type: String, 
        maxlength: 140
    },
    text: {
        required: true,
        type: String,
    },
    tags: [{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    askedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ask_date_time: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
});

questionSchema.virtual('url').get(function() {
    return '/posts/question/${this._id}';
});

questionSchema.pre('save', async function(next) {
    const User = require("./user"); 
    try {
        // Use `this.askedBy` to refer to the user ID
        const user = await User.findById(this.askedBy); 
        if (user && user.reputation >= 50) {
            next(); // Correctly proceed if condition is met
        } else {
            throw new Error("User does not have enough reputation to post.");
        }
    } catch (error) {
        next(error); // Properly pass the error to the next middleware
    }
});

module.exports = mongoose.model('Question', questionSchema);