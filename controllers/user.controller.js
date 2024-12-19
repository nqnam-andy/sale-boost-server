const User = require('../models/user.model');

exports.getUserBySiteId = async (req, res) => {
    try {
        const user = await User.findOne({siteId: req.params.siteId});
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { siteId } = req.body;

        const existingUser = await User.findOne({ siteId });
        if (existingUser) {
            const updatedUser = await reloadAmountActionForNewDay({ siteId });
            return res.status(200).json(updatedUser);
        }

        const newUser = new User({ siteId, amountAction: 20 });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        let user = await User.findOne({ siteId: req.params.siteId });
        let amountAction = user.amountAction;
        if (user && user.updatedAt.toISOString().split('T')[0] !== currentDate) {
          amountAction = 20;
        }
        user = await User.findOneAndUpdate(
            { siteId: req.params.siteId },
            { amountAction: amountAction - 1 },
            { new: true, runValidators: true }
        );
        console.log(user);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ siteId: req.params.siteId });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function reloadAmountActionForNewDay({ siteId }) {
    const currentDate = new Date().toISOString().split('T')[0];
    let user = await User.findOne({ siteId });
    console.log('updatedAt', user.updatedAt.toISOString().split('T')[0]);
    console.log('currentDate', currentDate);
    if (user && user.updatedAt.toISOString().split('T')[0] !== currentDate) {
        user = await User.findOneAndUpdate(
            { siteId: siteId },
            { amountAction: 20 },
            { new: true }
        );
        console.log('user', user);
    }

    return user;
}
