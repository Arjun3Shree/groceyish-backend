import setEnv from "./config/envConfig.js";
setEnv();
import connectDB from "./config/database.js";
import { app } from "./app.js";

const PORT = process.env.PORT

const runApp = function(){
    app.listen(PORT, ()=>{
        console.log("App is running on port:", PORT);
        console.log("ENV is in use: ", process.env.VALABC);
        console.log("My env is:", process.env.NODE_ENV);
    })
}

connectDB().then(runApp)
.catch((error)=>{
    console.log("MongoDB Connection error!", error);
})