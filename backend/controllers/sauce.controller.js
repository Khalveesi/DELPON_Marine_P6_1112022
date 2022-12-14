const fs = require("fs");
const joi = require("joi");
const Sauce = require("../models/Sauce.model");

const createUpdateSauceParamsSchema = joi
    .object({
        name: joi.string().required(),
        manufacturer: joi.string().required(),
        description: joi.string().required(),
        mainPepper: joi.string().required(),
        heat: joi.number().required().min(1).max(10),
        imageUrl: joi.string().optional(),
    })
    .options({
        allowUnknown: true,
    });

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    createUpdateSauceParamsSchema
        .validateAsync(sauceObject)
        .then((params) => {
            const sauce = new Sauce({
                ...params,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                }`,
            });
            sauce
                .save()
                .then(() =>
                    res.status(201).json({ message: "Sauce enregistrée !" })
                )
                .catch((error) => {
                    console.log("error.save", { error });
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            console.log("error.validate", { error });
            res.status(400).json({ error });
        });
};

exports.listSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce === null) {
                return res.status(404).json({ message: "sauce innexistante" });
            }
            res.status(200).json(sauce);
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const fileName = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${fileName}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() =>
                    res.status(200).json({ message: "Sauce supprimée" })
                )
                .catch((error) => res.status(400).json({ error }));
        });
    });
};

exports.updateSauce = (req, res) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : {
              ...req.body,
          };
    createUpdateSauceParamsSchema
        .validateAsync(sauceObject)
        .then((params) => {
            Sauce.findOne({ _id: req.params.id }).then((sauce) => {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Objet modifié" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => {
            console.log("error.validate", { error });
            res.status(400).json({ error });
        });
};

exports.likeDislikeSauce = (req, res) => {
    const isLike = req.body.like === 1;
    const isDislike = req.body.like === -1;
    const userId = req.auth.userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce === null) {
                return res
                    .status(404)
                    .json({ message: "Sauce innexistante !" });
            }
            const usersLikedSet = new Set(sauce.usersLiked);
            const usersDislikedSet = new Set(sauce.usersDisliked);
            if (isLike) {
                if (usersLikedSet.has(userId)) {
                    return res
                        .status(400)
                        .json({ message: "Action impossible !" });
                }
                usersDislikedSet.delete(userId);
                usersLikedSet.add(userId);
            } else if (isDislike) {
                if (usersDislikedSet.has(userId)) {
                    return res
                        .status(400)
                        .json({ message: "Action impossible!" });
                }
                usersLikedSet.delete(userId);
                usersDislikedSet.add(userId);
            } else {
                usersLikedSet.delete(userId);
                usersDislikedSet.delete(userId);
            }
            sauce.usersLiked = Array.from(usersLikedSet);
            sauce.usersDisliked = Array.from(usersDislikedSet);
            sauce.likes = usersLikedSet.size;
            sauce.dislikes = usersDislikedSet.size;
            sauce
                .save()
                .then(() =>
                    res
                        .status(200)
                        .json({ message: "likes et dislikes mis à jour" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
};
