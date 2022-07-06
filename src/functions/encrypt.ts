import CryptoJS from "crypto-js/";
import { credentials } from "../credentials";

export function encrypt(message: string) {
    return CryptoJS.AES.encrypt(message, credentials.cryptoJS.SECRET_KEY).toString()
}