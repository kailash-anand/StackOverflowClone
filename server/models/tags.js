const { default: mongoose } = require("mongoose");

// Tag Document Schema
const tagSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        maxlength: 20,
        unique: true
    },
    createdBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

tagSchema.virtual('url').get(function() {
    return '/posts/tag/${this._id}';
});

module.exports = mongoose.model('Tag', tagSchema);
