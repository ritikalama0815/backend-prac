import jwt from 'jsonwebtoken';
//intercept the network request, check for token, and verify that the token is correct for specific user

// next -> head to next endpoint if everything is good
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'nice try bud, u r not right person' });
        }
        //if token is valid, save user id to request for use in other routes
        req.user_id = decoded.id;
        next(); //proceed to the endpoint
    });
}

export default authMiddleware;