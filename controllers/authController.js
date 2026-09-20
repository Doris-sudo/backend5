import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../data/users.js';
import { isValidEmail, isValidPassword} from '../utils/validation.js';

export const register = async (req, res, next) => {
    try {
        const {name, email, password, role} =req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({
                success: false,
                message: "These fields are required"
            })
        }

        if(!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            })
        }

        if(role !== "admin" && role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Role must be either admin or user"
            })
        }

        const estinguisher = users.find((user)=> {
            user.email.toLowerCase() === email.toLowerCase()
        })

        if (estinguisher) {
            return res.status(409).json({
                success: false,
                message: "This email already exists"
            });
        }

        if(!isValidPassword(password)){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters and contain an uppercase letter, number and special character"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length +1,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        };

        users.push(newUser);

        const userResponse = {
            id: newUser.id, 
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        })
    }catch(e){
        next(e);
    }
};

export const login = async (req, res, next) => {

    try{
        const { email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Enter the required fields please"
            });
        }

        const user = users.find((user)=>{ return user.email.toLowerCase() === email.toLowerCase()

        })

        if(!user){
            return res.status(401).json({
                status: false,
                message: "Invalid email"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    }catch(e){
        next(e)
    }
};