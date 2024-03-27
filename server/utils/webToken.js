import jwt from "jsonwebtoken";


export const cookieOptions =  {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true
};

export const sendToken = (res, user, code, message) => {
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);

    res.status(code).cookie("chat-token", token,cookieOptions).json({
        success: true,
        message,
    });
    
};