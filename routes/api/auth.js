const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const {getUserById, getUserByEmail} = require('./dynamo');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  GET api/auth
//@desc   Test Route
//@access Private

router.get('/',auth, async (req, res) => {

    try {
        const user = await getUserById(req.user.id);

        res.json(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error');
    }
});

//Authenticate user and get token.
router.post('/',async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password){
        res.status(400)
            .json({errors: [{msg: 'Please provide an email and password'}]});
    }

    try {
        //See if the user exists
        let user = await getUserByEmail(email);

        if(!user){
           return res.status(400).json({errors:[{msg: 'Invalid Credentials'}]});
        }

        //match the email and password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res
             .status(400)
             .json({errors: [{msg: 'Invalid credentials'}]});
        }

        const payload = {
            user:{
                id:user.id
            }
        };

        jwt.sign(
            payload, 
            config.get(req.app.locals.jwtSecret), 
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

//Logout is dealt with on the frontend. 



module.exports = router;