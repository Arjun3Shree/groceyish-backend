import mongoose from "mongoose"

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect((`${process.env.MONGODB_URI}/${process.env.DB_NAME}`));
        console.log(`\n Mongodb Connected! DB-HOST: ${connectionInstance.connection.host}`);

    }catch(error){
        console.log("MongoDB Connection Error: ", error);
        process.exit(1);
    }
}

export default connectDB