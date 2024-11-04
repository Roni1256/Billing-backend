import User from "../models/user.model.js";
export const updatecompany = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}