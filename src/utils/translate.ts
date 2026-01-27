// @ts-ignore
import CryptoJS from "crypto-js";
import axios from "axios";

// 使用环境变量
const secretId = process.env.EXPO_PUBLIC_TENCENT_SECRET_ID;
const secretKey = process.env.EXPO_PUBLIC_TENCENT_SECRET_KEY;

if (!secretId || !secretKey) {
    throw new Error('腾讯云 API 密钥未配置，请检查环境变量');
}

interface SignatureParams {
    secretId: string;
    secretKey: string;
    service: string;
    action: string;
    region: string;
    version: string;
    payload: object;
    endpoint: string;
    timestamp?: number; // 可选，默认当前时间
}

interface SignatureResult {
    authorization: string;
    timestamp: number;
    date: string;
}

// 生成腾讯云TC3-HMAC-SHA256签名
export function generateSignature(params: SignatureParams): SignatureResult {
    const { secretId, secretKey, service, action, region, version, payload, endpoint, timestamp = Math.floor(Date.now() / 1000) } = params;
    const date = new Date(timestamp * 1000).toISOString().split("T")[0];

    // ************* 步骤 1：拼接规范请求串 *************
    const payloadStr = JSON.stringify(payload);
    const hashedRequestPayload = CryptoJS.SHA256(payloadStr).toString(CryptoJS.enc.Hex);

    const httpRequestMethod = "POST";
    const canonicalUri = "/";
    const canonicalQueryString = "";
    const canonicalHeaders =
        `content-type:application/json; charset=utf-8\n` +
        `host:${endpoint}\n` +
        `x-tc-action:${action.toLowerCase()}\n`;
    const signedHeaders = "content-type;host;x-tc-action";

    const canonicalRequest = [
        httpRequestMethod,
        canonicalUri,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        hashedRequestPayload
    ].join("\n");

    // ************* 步骤 2：拼接待签名字符串 *************
    const algorithm = "TC3-HMAC-SHA256";
    const hashedCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);
    const credentialScope = `${date}/${service}/tc3_request`;
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

    // ************* 步骤 3：计算签名 *************
    const kDate = CryptoJS.HmacSHA256(date, `TC3${secretKey}`);
    const kService = CryptoJS.HmacSHA256(service, kDate);
    const kSigning = CryptoJS.HmacSHA256("tc3_request", kService);
    const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString(CryptoJS.enc.Hex);

    // ************* 步骤 4：拼接 Authorization *************
    const authorization = `${algorithm} Credential=${secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return { authorization, timestamp, date };
}

const tencentTranslate = async (audioBase64: string, language?: { source: string, target: string }) => {
    console.log(audioBase64, "audioBase64");
    const endpoint = "tmt.tencentcloudapi.com";
    const service = "tmt";
    const region = "ap-shanghai";
    const action = "SpeechTranslate";
    const version = "2018-03-21";
    const payload = {
        SessionUuid: "test-session-123",
        Source: language?.source ?? "zh",
        Target: language?.target ?? "en",
        AudioFormat: 83886080, //mp3格式
        Seq: 0,
        IsEnd: 1,
        Data: audioBase64,
        ProjectId: 0,
    };

    // 生成签名
    const { authorization, timestamp } = generateSignature({
        secretId,
        secretKey,
        service,
        action,
        region,
        version,
        payload,
        endpoint,
    });

    // 发送请求
    try {
        const response = await axios.post(`https://${endpoint}`, payload, {
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json; charset=utf-8",
                Host: endpoint,
                "X-TC-Action": action,
                "X-TC-Timestamp": timestamp.toString(),
                "X-TC-Version": version,
                "X-TC-Region": region,
            },
        });
        console.log(response.data.Response);
        return { target: response.data.Response.TargetText, source: response.data.Response.SourceText };
    } catch (error) {
        console.error("语音识别失败:", error);
        return null;
    }
};

export default tencentTranslate;