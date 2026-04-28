import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        // Ensure variable names match your userModel
        const { name, email, password, role, specialization } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            specialization
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: user._id // Fixed typo here
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Use uppercase 'User' to match your import
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // Generate JSON Web Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};