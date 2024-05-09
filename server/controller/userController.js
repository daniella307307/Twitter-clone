const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Assuming the user schema is defined in a separate file

// Function to handle user registration
async function signUp(req, res) {
    try {
        // Extract user data from the request body
        const { firstname, lastname, email,password, comfirmPassword } = req.body;

        // Check if the password matches the confirmPassword
        if (password !== comfirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id },process.env.JWT_SECRET,{ expiresIn: '1h' });

        // Send success response with token
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function signIn(req, res) {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Compare the password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send success response with token
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { signUp,
    signIn
};
