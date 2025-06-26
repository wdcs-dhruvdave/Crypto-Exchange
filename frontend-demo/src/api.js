import axios from "axios";

const API_URL = process.env.REACT_APP_CRYPTO_API_URL;

const Crypto_Api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fetchCryptoData = async (page = 1) => {
    
  try {
    const response = await Crypto_Api.get(
      `assets?fields=id,symbol,name,metrics/market_data/price_usd&page=${page}&limit=10`
    );
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.message);
    return [];
  }
};

export const fetchCryptoDataforExchnage = async (id) =>{
  try{
    const response = await Crypto_Api.get(
    `assets?fields=symbol,name,metrics/market_data/price_usd&filter=symbol:btc`//&page=1&limit=10
      );
    console.log("🚀 ~ fetchCryptoDataforExchnage ~ response.data.data;:", response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.message);
    return [];
  }
}
