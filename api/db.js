const mongoose = require('mongoose');

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        //mongoose.connect(process.env.DB, connectionParams)
        mongoose.connect('mongodb+srv://BlogAdmin:QWYpcl8mjtkIW06e@cluster0.mjbxeci.mongodb.net/');
        console.log("Connected to database successfully")
    } catch (error) {
        console.log(error);
        console.log("Could not connect database!")
    }
}

