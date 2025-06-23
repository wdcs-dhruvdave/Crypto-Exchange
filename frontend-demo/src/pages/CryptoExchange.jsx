import React, { useState, useEffect } from "react";
import axios from "axios";

const CryptoExchange = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [datalimit, setDataLimit] = useState(10);
    const [sortOrder, setSortOrder] = useState("asc"); 

    const fetchCryptoData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://data.messari.io/api/v2/assets?fields=id,symbol,metrics/market_data&limit=${datalimit}`
            );
            const sortedData = response.data.data.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.metrics.market_data.price_usd - b.metrics.market_data.price_usd;
                } else {
                    return b.metrics.market_data.price_usd - a.metrics.market_data.price_usd;
                }
            });
            setCryptoData(sortedData);
        } catch (err) {
            console.error("Error fetching crypto data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptoData();
    }, [datalimit, sortOrder]); 

    const handleLoadmore = () => {
        setDataLimit((prevLimit) => prevLimit + 10);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="container mt-5">
            <h2>Crypto Exchange</h2>
            <button className="btn btn-secondary mb-3" onClick={toggleSortOrder}>
                Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
            <div className="table mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Price (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptoData.map((crypto) => (
                            <tr key={crypto.id}>
                                <td>{crypto.symbol}</td>
                                <td>{crypto.metrics.market_data.price_usd.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <p>Loading...</p>}
                <button className="btn btn-primary" onClick={handleLoadmore}>
                    Load More
                </button>                
            </div>
        </div>
    );
};

export default CryptoExchange;