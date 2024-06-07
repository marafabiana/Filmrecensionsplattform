const mongoose = require('mongoose')

const Review = mongoose.model('Review', {
    movieId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 10, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

});

module.exports = Review 