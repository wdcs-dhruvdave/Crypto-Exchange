import React, { useEffect, useState } from "react";
import { fetchCryptoDataforExchnage } from "../api";
import Select from "react-select";
import toast from "react-hot-toast";
import { ConfirmDialog,confirmDialog } from 'primereact/confirmdialog';

const CryptoExchange = () => {
  const [fromCurrency, setFromCurrency] = useState("Select Currency");
  const [toCurrency, setToCurrency] = useState("Select Currency");
  const [amount, setAmount] = useState(0);
  const [cryptoData, setCryptoData] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [usdprice, setUsdprice] = useState(null);
  const [oneusdprice, setOneusdprice] = useState(null);
  const [tooneusdprice, setToOneusdprice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  const confirm = () => {
    confirmDialog({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => handleConvert(),
        reject: () => toast.error('You have rejected'),
    }); 
}


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCryptoDataforExchnage();
        setCryptoData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch crypto data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCurrencyChange = (e) => {
    try{
          const newAmount = parseFloat(e.target.value);
    if (newAmount < 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    setAmount(newAmount);
    }
    catch(error){
    toast.error("Invalid input Error: ",error);
    }

  };

  useEffect(() => {
    try{
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

    }
    catch(error){
      toast.error("Error: ",error);
    }

  }, [fromCurrency, toCurrency, amount, cryptoData]);

  const defaultOption = { value: "Select Currency", label: "Select Currency" };

  const options = [
    defaultOption,
    ...cryptoData.map((coin) => ({
      value: coin.symbol,
      label: `${coin.symbol} - $${coin.metrics.market_data.price_usd.toFixed(2)}`,
    })),
  ];

  const handleConvert = () => {
    try{
    const from = cryptoData.find((coin) => coin.symbol === fromCurrency);
    const to = cryptoData.find((coin) => coin.symbol === toCurrency);

    if (
      fromCurrency === "Select Currency" ||
      toCurrency === "Select Currency" ||
      !from ||
      !to ||
      amount <= 0
    ) {
      toast.error("Please select valid currencies and enter a valid amount");
      return;
    }

    setIsConverting(true); 

    setTimeout(()=>{
      const rate =
      from.metrics.market_data.price_usd / to.metrics.market_data.price_usd;
    const result = (amount * rate).toFixed(2);
    setConvertedAmount(result);
    toast.success(`Conversion successful!, You have ${result} ${toCurrency}.`);
    setAmount(0);
    setFromCurrency("Select Currency");
    setToCurrency("Select Currency");
    setUsdprice(null);
    setOneusdprice(null);
    setToOneusdprice(null);
    setConvertedAmount(null);
    setIsConverting(false);
    },1500)

    }
    catch(error){
      toast.error("Error: ",error);
    }

  };

  const handleSwap = () => {
    try{
      if (
      fromCurrency === "Select Currency" ||
      toCurrency === "Select Currency"
    ) {
      toast.error("Cannot swap without valid selections");
      return;
    }
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  }
  catch(error){
    toast.error("Error: ",error);
  }

    }
  

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
                value={
                  options.find((opt) => opt.value === fromCurrency) ||
                  defaultOption
                }
                onChange={(selected) => setFromCurrency(selected.value)}
                isSearchable
              />

              <div className="mt-2">
                {usdprice && usdprice !== "NaN" && (
                  <p className="text-muted mb-0">
                    {amount} {fromCurrency} = ${usdprice} USD
                  </p>
                )}
              </div>
            </div>

            <div className="text-center mb-3">
              <button
                className="btn btn-outline-secondary"
                onClick={handleSwap}
              >
                Swap
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">You Receive:</label>
              <Select
                options={options.filter((opt) => opt.value !== fromCurrency)}
                value={
                  options.find((opt) => opt.value === toCurrency) ||
                  defaultOption
                }
                onChange={(selected) => setToCurrency(selected.value)}
                isSearchable
              />

              {convertedAmount && (
                <div className="mt-3">
                  {usdprice &&
                    usdprice !== "NaN" &&
                    usdprice > 0 &&
                    `You Will Receive ${convertedAmount} ${toCurrency}`}
                </div>
              )}
            </div>

              <button
                className="btn btn-primary w-100"
                onClick={confirm}
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Converting...
                  </>
                ) : (
                  "Convert"
                )}
              </button>
              <ConfirmDialog></ConfirmDialog>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;
