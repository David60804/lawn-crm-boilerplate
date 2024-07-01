const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } =  req.body;
    try{
        let user = await User.findOne({email});
        if (user) {
            return res.stataus(400).json({message: 'User already exists'});
        }

        user = new User({name, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {user:{id: user.id}};
        jwt.sign(payload, process.env.JWT_SECRET, {expireIn: 360000}, (err, token)=>{
            if(err) throw err;
            res.json({token});
        });
    }catch(error){
        res.status(500).json({message: 'Server error'});
    }
}