import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            
            token = token.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Middleware Decoded Payload:", decoded);
            req.user = decoded;   
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};