import User from "../models/User.js";



// Middleware to protect routes
export const protectRoute = async (req, res, next) => {

    try{
        const token =req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password"); 

        if(!user) return res.json({success:false,messagge: "User not found"});

        req.user = user;
        next();
    }
    catch(error){
        console.error("Auth middleware error:", error.message);
        res.json({success:false,message:"Not authorized, token failed "+error.message});
    }

}



