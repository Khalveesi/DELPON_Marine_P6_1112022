const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const signupParamsSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

exports.signup = (req, res) => {
    signupParamsSchema
        .validateAsync(req.body)
        .then((params) => {
            bcrypt
                .hash(params.password, 10)
                .then((hash) => {
                    const user = new User({
                        email: params.email,
                        password: hash,
                    });
                    user.save()
                        .then(() =>
                            res
                                .status(201)
                                .json({ message: "Utilisateur créé !" })
                        )
                        .catch((error) => {
                            console.log("user.signup save");
                            console.log(error);
                            res.status(400).json({ error });
                        });
                })
                .catch((error) => {
                    console.log("user.signup hash");
                    console.log(error);
                    res.status(500).json({ error });
                });
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email,
    })
        .then((user) => {
            if (user === null) {
                res.status(400).json({
                    message: "Paire identifiant/Mot de passe invalide !",
                });
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(400).json({
                                message:
                                    "Paire identifiant/Mot de passe invalide !",
                            });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {
                                        userId: user._id,
                                    },
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn: "24H",
                                    }
                                ),
                            });
                        }
                    })
                    .catch((error) =>
                        res.status(500).json({
                            error,
                        })
                    );
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
