const permitUser=(req,res,next)=>{
    return (req,res,next)=>{
        const userRole= req.body.role;
        if(permissions.includes(userRole)){
            next();
        }else{
            return res.status(401).json("You do not have permission.")
        }
    };
};
const permitCourse=(req,res,next)=>{
    return (req,res,next)=>{
        const userRole= req.body.role;
        if(permissions.includes(userRole)){
            next();
        }else{
            return res.status(401).json("You do not have permission.")
        }
    };
};

module.exports={permitUser, permitCourse};