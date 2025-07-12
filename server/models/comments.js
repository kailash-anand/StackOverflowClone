const { default: mongoose } = require("mongoose");

//Comment Schema
const commentSchema = mongoose.Schema({
    text: {
        required: true,
        type: String,
        maxlength: 140
    },
    authorId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    answer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    ask_date_time: {
        required: true,
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    }
})

commentSchema.virtual('url').get(function() {
    return '/posts/comment/${this._id}';
});

module.exports = mongoose.model('Comment', commentSchema);