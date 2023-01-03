const Sauce = require("../models/Sauce.model");

module.exports = (req, res, next) => {
    try {
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: "Action non-autorisée" });
            } else {
                next();
            }
        });
    } catch (error) {
        console.log("isOwner.middleware", { error });
        res.status(401).json({ error });
    }
};
