const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    try{
        const authHeader = req.header("Authorization");

        if(!authHeader)
            return res.status(401).json("No token, access denied");

        const token = authHeader.split(" ")[1];

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;
        next();

    }catch(err){
        res.status(400).json("Invalid token");
    }
};

module.exports = authMiddleware;