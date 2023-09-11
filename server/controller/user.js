import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const signup = async (req, res) => {
    // TODO: add phone_no!
    const { firstName, lastName, email, password, phone_no, confirmPassword } = req.body;

    try {
        // Check DB if user exists already
        const userExists = await User.findOne({ email });

        if (userExists)
            return res.status(404).json({ message: "User already exists with that email" });

        if (password !== confirmPassword)
            return res.status(404).json({ message: "Passwords do not match" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // TODO: update below to match User model!
        const newUser = await User.create({ firstName, lastName, email, phone_no, password: hashedPassword });

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", { expiresIn: "1h" });

        return res.status(200).json({ result: newUser, token });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again" });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const exisitingUser = await User.findOne({ email });

        if (!exisitingUser)
            return res.status(404).json({ message: "Invalid email/password" });

        const isPasswordCorrect = await bcrypt.compare(password, exisitingUser.password);

        if (!isPasswordCorrect)
            return res.status(404).json({ message: "Invalid email/password" });

        const token = jwt.sign({ email: exisitingUser.email, id: exisitingUser._id }, "test", { expiresIn: "1h" });
        return res.status(200).json({ result: exisitingUser, token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { firstName, lastName, phone_no, oldEmail, email, password, confirmPassword } = req.body;


    try {
        // Check DB if user exists
        const oldUser = await User.findOne({ email: oldEmail });
        const existingUser = await User.findOne({ email });

        if (oldEmail !== email && existingUser)
            return res.status(404).json({ message: "A user already exists with that email" });

        if (!oldUser)
            return res.status(404).json({ message: "This user doesn't exist" });

        if (!password || !confirmPassword)
            return res.status(404).json({ message: "Password cannot be empty" });

        if (password !== confirmPassword)
            return res.status(404).json({ message: "Passwords don't match" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        oldUser.firstName = firstName;
        oldUser.lastName = lastName;
        oldUser.email = email;
        oldUser.password = hashedPassword;
        oldUser.phone_no = phone_no;

        const token = jwt.sign({ email, id: oldUser._id }, "test", { expiresIn: "1h" });

        const updatedUser = await User.findOneAndUpdate({ _id: userId }, oldUser, { new: true });

        return res.status(200).json({ result: updatedUser, token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong. Please try again" });
    }
};