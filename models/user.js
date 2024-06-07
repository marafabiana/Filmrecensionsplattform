const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }

});

module.exports = User