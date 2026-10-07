const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 4002;

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        app.listen(port, () => {
            console.log(`server run on ${port}`);
        });

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log("DB ERROR:", err.message);
        } else {
            console.log("DB ERROR:", err);
        }
    }
})();