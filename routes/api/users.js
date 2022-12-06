const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route Post api/users
//@desc Register user
//@access Public

router.post('/', 
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required/should be valid').isEmail(),
    check('password', 'Please Enter a password with 8 or more characters').isLength({ min:8 })
],

async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try{
        let user = await User.findOne({ email });

        if(user){
            res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        
        //See if user exists
        //Get user gravatar
        //Encrypt Password
        //Return jsonwebtoken

        res.send('User Route');
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }   
});

module.exports = router;