const mongoose = require('mongoose');

const Movie = mongoose.model('Movie', {
    title: {
        type: String, 
        required: true 
    },
    director: { 
        type: String, 
        required: true 
    },
    releaseYear: { 
        type: Number, 
        required: true 
    },
    genre: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

module.exports = Movie