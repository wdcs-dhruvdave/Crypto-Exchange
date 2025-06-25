import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://data.messari.io/api/v2/assets?fields=id,symbol,name,metrics/market_data/price_usd&page=${page}&limit=10`
      );
      console.log("🚀 ~ fetchCryptoData ~ response:", response)
      

      const newData = response.data.data;

      const combined = [...allData, ...newData];

      const sortedData = combined.sort((a, b) =>
        sortOrder === "asc"
          ? a.metrics.market_data.price_usd - b.metrics.market_data.price_usd
          : b.metrics.market_data.price_usd - a.metrics.market_data.price_usd
      );

      setAllData(sortedData);
      setCryptoData(sortedData);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottomReached && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...allData].sort((a, b) =>
      newOrder === "asc"
        ? a.metrics.market_data.price_usd - b.metrics.market_data.price_usd
        : b.metrics.market_data.price_usd - a.metrics.market_data.price_usd
    );

    setAllData(sorted);
    setCryptoData(sorted);
  };

  const handleLoadmore = () => {
    if (!loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);

    const filtered = allData.filter((item) =>
      item.symbol.toLowerCase().includes(value.toLowerCase()) ||
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setCryptoData(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Crypto Exchange</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-secondary d-flex align-items-center gap-2"
          onClick={toggleSortOrder}
        >
          Sort
          <img
          src={sortOrder === "asc" ? "/sort-ascending.png" : "/sort-decending.png"}
          alt="Sort Icon"
          width={20}
          height={20}
        />

        </button>

        <form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by symbol or name..."
            value={search}
            onChange={handleSearch}
          />
        </form>
      </div>

      {loading && cryptoData.length === 0 ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto) => (
                  <tr key={crypto.id}>
                    <td>{crypto.symbol}</td>
                    <td>{crypto.name}</td>
                    <td>
                      $
                      {crypto.metrics.market_data.price_usd.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-3 align-items-center">
          <div className="col text-start"></div>

          <div className="col text-center">
            {loading && <span className="text-muted">Loading...</span>}
          </div>

          <div className="col text-end">
            <button
              className="btn btn-primary"
              onClick={handleLoadmore}
              disabled={loading}
            >
              Load More
            </button>
          </div>
        </div>

        </>
      )}
    </div>
  );
};

export default Home;
