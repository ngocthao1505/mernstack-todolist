const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb+srv://thaoltn1505:Ngocthao98@thaoltncluster.ej43s.mongodb.net/todolist?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    mongoose.Promise = global.Promise;

    mongoose
      .connect(MONGO_URI, { useUnifiedTopology: true })
      .then(() => {
        console.log("Connected to MongoDB: %s \n ", MONGO_URI);
      })
      .catch((error) => {
        console.log("MongoDB connection error: %s \n", error);
      });
  } catch (error) {
    console.log("Error in DB connection: " + error);
    process.exit(1);
  }
};

module.exports = connectDB;
