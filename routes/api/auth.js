const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


//@route Get api/auth
//@desc Test route
//@access Public

router.get('/', auth, async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Post api/users
//@desc Register user
//@access Public

router.post('/', 
[
    
    check('email', 'Email is required/should be valid').isEmail(),
    check('password', 'Passwored Required').exists()
],

async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        
        //See if user exists

         if(!user){
           return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        //check to see if not a match
        
        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        //Return jsonwebtoken

        const payload = {
            user:{
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) =>{
                if(err) throw err;
                res.json({ token });
            });
        
        
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
});


module.exports = router;