const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Register User /register
exports.registerUser = async (req, res) => {
  const { username, email, password, confirmpassword } = req.body;

  // validations
  if(!username) {
    return res.status(422).json({message: 'The username is required'});
}

if(!email) {
    return res.status(422).json({message: 'The email is required'});
}

if(!password) {
    return res.status(422).json({message: 'The password is required'});
}

if(password !== confirmpassword) {
    return res.status(422).json({message: 'Passwords do not match'});
}
  // check if user exists - using query
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(422).json({ message: 'This email is already in use' })
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  
  // create user
  const user = new User({ 
    username, 
    email, 
    password: passwordHash,
    role: 'user'
});
    

  try {
    await user.save();

    res.status(201).json({ message: 'Your account has been created successfully' });

  } catch (error) {
    console.log(error)

    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// Login User /login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  // validations
  if(!email) {
    return res.status(422).json({message: 'The email is required'});
}

    if(!password) {
        return res.status(422).json({message: 'The password is required'});
    }

  //check if user exists
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: 'User Not Found' })
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password)
  if(!checkPassword) {
    return res.status(422).json({ message: 'Invalid Password' }); 
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
};
