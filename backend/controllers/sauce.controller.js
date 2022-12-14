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
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({ message: "Action non-autorisée" });
        } else {
            const fileName = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${fileName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res.status(200).json({ message: "Sauce supprimée" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        }
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
                if (sauce.userId != req.auth.userId) {
                    req.status(401).json({ message: "Non-autorisé" });
                } else {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { ...sauceObject, _id: req.params.id }
                    )
                        .then(() =>
                            res.status(200).json({ message: "Objet modifié" })
                        )
                        .catch((error) => res.status(400).json({ error }));
                }
            });
        })
        .catch((error) => {
            console.log("error.validate", { error });
            res.status(400).json({ error });
        });
};

exports.likeDislikeSauce = (req, res) => {};
