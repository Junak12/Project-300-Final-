import jwt from 'jsonwebtoken';

// Admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        const atoken = req.headers['atoken'];  // lowercase key
        if (!atoken) {
            return res.status(401).json({ message: 'Not authorized : Login Again' });
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        // Here you can check token_decode content as needed
        // For example, if token_decode.email === process.env.ADMIN_EMAIL etc.
        next();
    } catch (error) {
        console.log('Error in authAdmin middleware:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
}


export default authAdmin;
