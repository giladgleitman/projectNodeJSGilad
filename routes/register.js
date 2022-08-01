const express = require("express");
const { User } = require("../models/User");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const registerSchema = joi.object({
  name: joi.string().required().min(2),
  email: joi.string().required().min(6).max(1024).email(),
  password: joi.string().required().min(6).max(1024),
  biz: joi.boolean().required(),
});

router.post("/", async (req, res) => {
  try {
    //joi validation
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    //check if already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Exist");

    user = new User(req.body);
    //encrypt to password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //create and save user in db
    await user.save();
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.secretKey
    );
    res.status(201).send({ token: genToken });
  } catch (error) {
    res.status(400).send("Error in post user");
  }
});

module.exports = router;
