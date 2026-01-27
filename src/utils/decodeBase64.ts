import CryptoJS from "crypto-js";

const decodeBase64 = (str?: string): string => {
    try {
        // 将 base64 转换为原始字符串
        const words = CryptoJS.enc.Base64.parse(str ?? "");
        return words.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Base64 解码错误:", error);
        return "";
    }
};

export default decodeBase64;
