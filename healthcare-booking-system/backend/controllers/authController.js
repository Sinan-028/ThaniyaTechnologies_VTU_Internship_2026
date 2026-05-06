import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//  GENERATE TOKEN
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    //  Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    //  Validate doctor specialization
    if (role === 'doctor' && !specialization) {
      return res.status(400).json({
        message: 'Specialization is required for doctors'
      });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      specialization
    });

    //  Response
    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization || null
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });

    //  Invalid credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //  Response
    res.json({
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization || null
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};