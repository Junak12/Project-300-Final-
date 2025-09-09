import jwt from 'jsonwebtoken';

//user authentication middleware
const authUser = (req, res, next) => {
    try {
        const {token} = req.headers;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized : Login Again' });
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: token_decode.id };
        next();
    } catch (error) {
        console.log('Error in authAdmin middleware:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
}
export default authUser;