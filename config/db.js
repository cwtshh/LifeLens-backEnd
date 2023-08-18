const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// connect to database
const conn = async () => {
    try {
        const dbConn = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.dcumxvl.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log('Conectado ao banco!');
        return dbConn;
    } catch (e) {
        console.log(e);
    }
};

conn();

module.exports = conn;