const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    // console.log(req.headers)
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided'
        })
    }
    try {
        console.log(process.env.SECRET_KEYs)
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            message: 'Invalid token from verified middleware.'
        });
    }
};

module.exports = verifyToken;