import CryptoJS from "crypto-js/";
import { credentials } from "../credentials";

export function decrypt(message: string) {
    return CryptoJS.AES.decrypt(message, credentials.cryptoJS.SECRET_KEY).toString(CryptoJS.enc.Utf8)
}