import CryptoJS from "crypto-js";

export const encryptCardDetails = async (cardDetails, key, iv) => {
  console.log(cardDetails)
  const val = CryptoJS.enc.Utf8.parse(JSON.stringify(cardDetails))
  const data1 = CryptoJS.AES.encrypt(val, CryptoJS.enc.Base64.parse(key), {
    iv: CryptoJS.enc.Base64.parse(iv),
    mode: CryptoJS.mode.CBC,
  }).toString();
  console.log(val)
  return data1
}