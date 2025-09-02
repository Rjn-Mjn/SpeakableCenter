/**
 * Authentication Controller
 * Handles all authentication-related business logic
 */

import bcrypt from 'bcrypt';
import { getUserByEmail, createUser, updateUserLoginTime } from '../services/authService.js';

/**
 * Login Controller
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Get user from database
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'account-not-found'
            });
        }

        // Check if account is pending
        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: 'pending-account'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'wrong-password'
            });
        }

        // Update last login time
        await updateUserLoginTime(user.id);

        // Set session
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Register Controller
 */
export const register = async (req, res) => {
    try {
        const { email, password, fullName, googleid } = req.body;

        // Validate input
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await createUser({
            email,
            password: hashedPassword,
            fullName,
            googleId: googleid || null
        });

        // Set session
        req.session.userId = newUser.id;
        req.session.userEmail = newUser.email;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Logout Controller
 */
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Could not log out'
            });
        }
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
};

/**
 * Get current user
 */
export const getCurrentUser = (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    res.json({
        success: true,
        user: {
            id: req.session.userId,
            email: req.session.userEmail
        }
    });
};
