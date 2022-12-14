const multer = require("multer");
const crypto = require("crypto");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        try {
            const name = crypto.createHash("md5").update(
                file.originalname.split(" ").join("_")
            ).digest("hex");
            const extension = MIME_TYPES[file.mimetype];
            if (extension === null) {
                return callback(new Error(`Format d'image invalide !`));
            }
            callback(null, name + Date.now() + "." + extension);
        } catch (error) {
            console.log("multer.error", { error });
        }
    },
});

module.exports = multer({ storage: storage }).single("image");
