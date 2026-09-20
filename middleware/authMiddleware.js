import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }

        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                status:false,
                message: "Invalid authorization format"
            })
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next()
    }catch(e){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            })
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

};

export default authenticate;