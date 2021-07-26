const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Register
router.post('/register', async (req,res) => {

    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the new user already exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('email already exists');

    //Hasing the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user.id});
    }catch(error){
        res.status(400).send(error);
    }
});

//Login
router.post('/login', async (req,res) => {

    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('user does not exist');

    //check user's password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('password is not correct');
    
    //Create and assign a token
    const token = jwt.sign({id: user.id}, process.env.TOKEN_S)
    res.header('auth-token', token).send(token);

});

module.exports = router;
