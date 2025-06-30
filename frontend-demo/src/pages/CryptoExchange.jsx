import React, { useEffect, useState, useCallback } from "react";
import { fetchCryptoDataforExchnage } from "../api";
import Select from "react-select";
import toast from "react-hot-toast";

const CryptoExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [amount, setAmount] = useState(0);
  const [cryptoData, setCryptoData] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [usdprice, setUsdprice] = useState(null);
  const [oneusdprice, setOneusdprice] = useState(null);
  const [tooneusdprice, setToOneusdprice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchData = useCallback(async() => {
      try {
        setLoading(true);
        const data = await fetchCryptoDataforExchnage(["btc", "eth", "usdt"]);
        setCryptoData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch crypto data");
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
  fetchData();
  }, [fetchData]);

  const handleCurrencyChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    if (newAmount < 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    setAmount(newAmount);
  };

  useEffect(() => {
    const fromCrypto = cryptoData.find((coin) => coin.symbol === fromCurrency);
    const toCrypto = cryptoData.find((coin) => coin.symbol === toCurrency);

    if (fromCrypto) {
      const usd = (amount * fromCrypto.metrics.market_data.price_usd).toFixed(2);
      const oneusd = fromCrypto.metrics.market_data.price_usd.toFixed(2);
      setUsdprice(usd);
      setOneusdprice(oneusd);
    }

    if (toCrypto) {
      const toone = toCrypto.metrics.market_data.price_usd.toFixed(2);
      setToOneusdprice(toone);
    }

    if (fromCrypto && toCrypto && amount > 0) {
      const rate =
        fromCrypto.metrics.market_data.price_usd / toCrypto.metrics.market_data.price_usd;
      setConvertedAmount((amount * rate).toFixed(2));
    }
  }, [fromCurrency, toCurrency, amount, cryptoData]);

  const options = cryptoData.map((coin) => {
    return {
      value: coin.symbol,
      label: `${coin.symbol} - $ ${(coin.metrics.market_data.price_usd).toFixed(2)}`,
    };
  });

  const handleConvert = () => {
    const from = cryptoData.find((coin) => coin.symbol === fromCurrency);
    const to = cryptoData.find((coin) => coin.symbol === toCurrency);

    if (from && to && amount > 0) {
      const rate =
        from.metrics.market_data.price_usd / to.metrics.market_data.price_usd;
      setConvertedAmount((amount * rate).toFixed(2));
    } else {
      toast.error("Please select valid currency");
    }
  };

  const handleSwap = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
        <p>Loading crypto data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crypto Exchange Calculator</h2>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label fw-bold">You Pay</label>
              <input
                type="number"
                className="form-control mt-2"
                placeholder="Enter amount"
                value={amount}
                min="0"
                onChange={handleCurrencyChange}
              />

              <br />
              <label className="form-label fw-bold">Currency</label>
              <Select
                options={options.filter((opt) => opt.value !== toCurrency)}
                value={options.find((opt) => opt.value === fromCurrency)}
                onChange={(selected) => setFromCurrency(selected.value)}
                isSearchable
              />

              <div className="mt-2">
                {usdprice && (
                  <p className="text-muted mb-0">
                    {amount} {fromCurrency} = ${usdprice} USD
                  </p>
                )}

              </div>
            </div>

            <div className="text-center mb-3">
              <button className="btn btn-outline-secondary" onClick={handleSwap}>
                Swap
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">You Receive:</label>
              <Select
                options={options.filter((opt) => opt.value !== fromCurrency)}
                value={options.find((opt) => opt.value === toCurrency)}
                onChange={(selected) => setToCurrency(selected.value)}
                isSearchable
              />
              <div className="mt-2">

              </div>
                 {convertedAmount && (
              <div className="mt-3">
                You Will Receive {convertedAmount} {toCurrency}{/* {amount} {fromCurrency} =  */}
              </div>
            )}  
            </div>

            <button className="btn btn-primary w-100" onClick={handleConvert}>
              Convert
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;
