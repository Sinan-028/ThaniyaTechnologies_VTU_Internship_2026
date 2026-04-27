import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try{
        const {name, email, password, role, designation } = req.body;

        //checks user exstnce
        const userExists = await User.findOne({ mail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    //Hash passwrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //user crtn
    const user = await User.create({
        name,
        emsail,
        password: hashedPassword,
        role,
        specialization
    });

    res.status(201).json({ message: 'User registered successfully', userId: user_id});
    }catch (error) {
        res.status(500).json({ message: error.message});
    }
};