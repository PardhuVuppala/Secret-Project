const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const randomize = require('randomatic');
const userModel = require('../modals/user_schema');
const jwtgenerator = require("../JwtToken/jwtgenerator");
const Authorize = require("../middleware/authorization");
const mailservice = require("../services/registrationServices");


router.post('/register', async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ useremail: req.body.useremail });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(req.body.userpass, 10);
        const userObj = new userModel({
            username: req.body.username,
            useremail: req.body.useremail,
            usermobile: req.body.usermobile,
            userdob: req.body.userDOB,
            userpass: hashedPassword,
            usergender: req.body.usergender,
            usercountry: req.body.usercountry,
            useraddress: req.body.useraddress,
        });
        const insertdocument = await userObj.save();
        res.status(200).send(true);
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error in Saving Data of User' });
    }
});





router.post('/login',async(req,res) =>
    {
        try{ 
            const{useremail, userpass} = req.body;
            console.log(useremail)
            const user = await userModel.findOne({useremail : req.body.useremail});
            if(!user)
            {
             return res.status(401).json({message: "Invalid Credentials" });
            }
            const passwordMatch = await bcrypt.compare(userpass, user.userpass);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
           
            const token = jwtgenerator(user.id)
            const user_id = user.id;
            const username = user.username;
            const phone = user.usermobile;
            const email = user.useremail;
            const role = "user"
            const body={
                token,
                user_id,
                role,
                username,
                phone,
                email
            }
            res.json(body);
        }
        catch(err)
        {    
            console.log(err)
            res.status(500).json({ message: err.message || 'Error occurred during login' });
        }
    });
    

    router.get("/is-verify", Authorize, async (req, res) => {
        try {
          res.json(true);
        } catch (err) {
          res.status(500).send("Server Error");
        }
    });

    module.exports = router;