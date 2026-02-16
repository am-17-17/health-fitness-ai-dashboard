import jwt from "jsonwebtoken";

// Middleware to protect routes

const authMiddleware = (req, res, next) => {
    
    try {
        
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Access denied .No token provided" });

        }

        const actualToken = token.startsWith("Bearer ")

            ? token.split(" ")[1]
            : token;
        
        // Verify token using secret

        const decode = jwt.verify(actualToken, process.env.JWT_SECRET);

        req.user = decode;

        next(); // constinue to next middleware / route
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;