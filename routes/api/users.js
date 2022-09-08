const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
var {getUser, createUser,getUserByEmail} = require('./dynamo');
const {randomUUID} = require("crypto");


router.post('/',async (req, res) => {

    const {name, email, password } = req.body;

    try {
        //See if the user exists
        let user = await getUserByEmail(email);

        if(user){
           return res.status(400).json({errors:[{msg: 'User already exists'}]});
        }

        user = {        
            email,
            createdAt: Date.now().toString(),
            name,
            password,
            id: randomUUID()
        }
        
        //Encrypt the Password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        //create User in the database
        var userCreated = await createUser(user);

        if(!userCreated){
            return res.status(500).send(userCreated.error);
        }
        const payload = {
            user:{
                id:user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            {expiresIn:360000}, 
            (err, token) => {
            if(err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;


// const gravatar = require('gravatar');

// const {check, validationResult} = require('express-validator');

// const User = require('../../models/User');

//@route  POST api/users
//@desc   Register User Route
//@access Public


// [
//     check('name', 'Name is required').not().isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Please enter a password with 6 or more characters').isLength({
//         min:6
//     })
// ],

    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //    res.status(400).json({errors: errors.array()});
    //    return;
    // }