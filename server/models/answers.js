const { default: mongoose } = require("mongoose");

// Answer Document Schema
const answerSchema = mongoose.Schema({
    text: {
        required: true,
        type: String
    },
    ans_by: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ans_date_time: {
        type: Date,
        default: Date.now
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

answerSchema.virtual('url').get(function() {
    return 'posts/answer/${this._id}';
})

module.exports = mongoose.model('Answer', answerSchema);