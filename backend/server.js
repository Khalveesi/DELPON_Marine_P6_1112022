require("dotenv").config();
const app = require("./app");
const connection = require("./mongoose");

connection
    .then(() => console.log("connection à MongoDB réussie !"))
    .catch(() => {
        console.log("connection à MongoDB échoué !");
        process.exit(1);
    });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
