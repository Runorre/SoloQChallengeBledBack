import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/index.js';


export const adminHandler = async(req, res, next) => {
    try {
        let user = await UserModel
                            .findById(res.locals.decoded._id)
                            .select({role: 1})
                            .lean();
        if (user.role == "ADMIN")
            return next();

        return res.status(401).json({
            success : false,
            error : "Unauthorized access",
        });
    } catch (err) {
        return res.status(500).json({
            success : false,
            error : "Internal server error",
        });
    }
}


export const userRoleHandler = (role) => {
    return async(req, res, next) => {
        try {
            let user = await UserModel
                                .findById(res.locals.decoded._id)
                                .select({role: 1})
                                .lean();
            res.locals.decoded.role = user.role;

            if (res.locals.decoded.role == role)
                return next();

            return adminHandler(req, res, next);
        } catch(err) {
            return res.status(500).json({
                success : false,
                error : "Internal server error",
            });
        }
    }
};

export const bearerTokenHandler = async(req, res, next) => { 
    var token = req.headers['authorization'];

    try {
        if (!!token && token.startsWith('Bearer '))
            token = token.slice(7, token.length);

        if (!token)
            return res.status(401).json({
                succes : false,
                error : "Missing token",
        });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel
                            .findById(decoded._id)
                            .select({password: 0})
                            .lean();
        
        res.locals.decoded = user;
        return next();
    } catch(err) {
        if ((err).message == "jwt expired")
            return res.status(401).json({
                success : false,
                error : "Token expired",
            });
        console.log(err)
        res.status(401).json({
            success : false,
            error : "Invalid token",
        });
    }
};