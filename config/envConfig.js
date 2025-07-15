import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const setEnv = () => {
    switch(process.env.NODE_ENV){
        case "development":
            dotenv.config({
                path: resolve(__dirname, "../env/.env.development"),
            });
        break;
        case "test":
            dotenv.config({
                path: resolve(__dirname, "../env/.env.test"),
            })
        break;
        default:
            dotenv.config({
                path: resolve(__dirname, "../env/.env.development"),
            })
        break;
    }
}

export default setEnv;