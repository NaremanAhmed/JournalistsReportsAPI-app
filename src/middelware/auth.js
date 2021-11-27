const jwt = require("jsonwebtoken");
const User = require("../models/journalist");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    const decode = jwt.verify(token, "newspaper-app");
    // console.log(decode);
    const journalist = await Journalist.findOne({ _id: decode._id, "tokens.token": token});
    // console.log(journalist);
    if (!journalist) {
      throw new Error();
    }
    //
    req.journalist = journalist;
    //--logout
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "plese authencticate!..." });
  }
};

//dont forgget//
module.exports = auth;
