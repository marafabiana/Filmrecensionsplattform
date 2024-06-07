//1 Imports
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/checkAuth');


//2 Endpoints:
//Private Route /user/:id
router.get('/user/:id', checkAuth, async (req, res) => {

    const id = req.params.id

    //check id user exists
    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({ message: 'User Not Found'})
    }

    res.status(200).json({ user })
});


//Register User /register
router.post('/register', async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    //validations
    if(!username) {
        res.status(422).json({message: 'The username is required'});
        return
    }

    if(!email) {
        res.status(422).json({message: 'The email is required'});
        return
    }

    if(!password) {
        res.status(422).json({message: 'The password is required'});
        return
    }

    if(password !== confirmpassword) {
        res.status(422).json({message: 'Passwords do not match'});
        return
    }

    //check if user exists - using query
    const userExists = await User.findOne({ email: email })

    if(userExists) {
        res.status(422).json({message: 'This email is already in use'});
        return  
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        username,
        email,
        password: passwordHash,
        role: 'user'
    });

    try {
        await user.save() 

        res.status(201).json({ message: 'Your account has been created successfully' })

    } catch (error) {
        console.log(error)

        res.status(500).json({ message: 'Server error, try again later' })
    }

});

//Login User /login
router.post('/login', async (req, res) => {

    const {email, password} = req.body 

    //validations
    if(!email) {
        res.status(422).json({message: 'The email is required'});
        return
    }

    if(!password) {
        res.status(422).json({message: 'The password is required'});
        return
    }

    //check if user exists
    const user = await User.findOne({ email: email })

    if(!user) {
        res.status(404).json({ message: 'User Not Found' });
        return  
    }

    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        res.status(422).json({ message: 'Invalid Password' });
        return  
    }

    try {
        const secret = process.env.SECRET 

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            secret, 
        );

        res.status(200).json({ message: 'Authentication Successful', token })

    } catch (error) {
        console.log(error)

        res.status(500).json({ message: 'Server error, try again later' })
    }
});


module.exports = router;


