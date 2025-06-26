import React, { useEffect, useState } from "react";
import { fetchCryptoDataforExchnage } from "../api";

const CryptoExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [amount, setAmount] = useState(1);
  const [cryptoData, setCryptoData] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCryptoDataforExchnage(["btc", "eth", "usdt"]);
      setCryptoData(data);
    };
    fetchData();
  }, []);

  const handleConvert = () => {
    const from = cryptoData.find((coin) => coin.symbol === fromCurrency);
    const to = cryptoData.find((coin) => coin.symbol === toCurrency);

    if (from && to) {
      const rate =
        from.metrics.market_data.price_usd / to.metrics.market_data.price_usd;
      setConvertedAmount((amount * rate).toFixed(6));
    }
  };

  const handleSwap = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);

    const from = cryptoData.find((coin) => coin.symbol === newFrom);
    const to = cryptoData.find((coin) => coin.symbol === newTo);

    if (from && to) {
      const rate =
        from.metrics.market_data.price_usd / to.metrics.market_data.price_usd;
      setConvertedAmount((amount * rate).toFixed(6));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crypto Exchange Calculator</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label fw-bold">From Currency</label>
              <select
                className="form-select"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {cryptoData.map((coin) => (
                  <option key={coin.symbol} value={coin.symbol}>
                    {coin.symbol}
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="form-control mt-2"
                value={amount}
                min="0"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="text-center mb-3">
              <button className="btn btn-outline-secondary" onClick={handleSwap}>
                 Swap
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">To Currency</label>
              <select
                className="form-select"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {cryptoData.map(
                  (coin) =>
                    coin.symbol !== fromCurrency && (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.symbol}
                      </option>
                    )
                )}
              </select>
            </div>

            <button className="btn btn-primary w-100" onClick={handleConvert}>
              Convert
            </button>

            {convertedAmount && (
              <div className="alert alert-success mt-3">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;
