import React, { useState, useEffect } from "react";
import { fetchCryptoData } from "../api";

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [searchSymbol, setSearchSymbol] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

  const [sortKey, setSortKey] = useState("price");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortData = (key, direction, data) => {
    return [...data].sort((a, b) => {
      let valA, valB;

      if (key === "price") {
        valA = a.metrics.market_data.price_usd;
        valB = b.metrics.market_data.price_usd;
      } else if (key === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (key === "symbol") {
        valA = a.symbol.toLowerCase();
        valB = b.symbol.toLowerCase();
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    const newDirection = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);

    const sorted = sortData(key, newDirection, [...cryptoData]);
    setCryptoData(sorted);
  };

  const loadCryptoData = async () => {
    setLoading(true);
    try {
      const newData = await fetchCryptoData(page);
      const combined = [...allData, ...newData];
      const sortedData = sortData(sortKey, sortDirection, combined);

      setAllData(sortedData);
      setCryptoData(sortedData);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    const filteredData = allData.filter((data) => {
      const symbolMatch = data.symbol.toLowerCase().includes(searchSymbol.toLowerCase());
      const nameMatch = data.name.toLowerCase().includes(searchName.toLowerCase());

      const price = data.metrics.market_data.price_usd;
      const priceStr = price.toString();
      const decimalPart = price.toFixed(6).split(".")[1].slice(0, 3);
      const priceMatch = priceStr.includes(searchPrice) || decimalPart.includes(searchPrice);

      return symbolMatch && nameMatch && priceMatch;
    });

    const sortedFiltered = sortData(sortKey, sortDirection, filteredData);
    setCryptoData(sortedFiltered);
  }, [searchSymbol, searchName, searchPrice, sortKey, sortDirection, allData]);

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Crypto Exchange</h2>

      {loading && cryptoData.length === 0 ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-2 mb-1"
                      onClick={() => handleSort("symbol")}
                    >
                      Sort
                      <img
                        src={
                          sortKey === "symbol" && sortDirection === "asc"
                            ? "/sort-ascending.png"
                            : "/sort-decending.png"
                        }
                        alt="Sort Icon"
                        width={20}
                        height={20}
                      />
                    </button>
                    Symbol
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Symbol"
                      value={searchSymbol}
                      onChange={(e) => setSearchSymbol(e.target.value)}
                    />
                  </th>
                  <th>
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-2 mb-1"
                      onClick={() => handleSort("name")}
                    >
                      Sort
                      <img
                        src={
                          sortKey === "name" && sortDirection === "asc"
                            ? "/sort-ascending.png"
                            : "/sort-decending.png"
                        }
                        alt="Sort Icon"
                        width={20}
                        height={20}
                      />
                    </button>
                    Name
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </th>
                  <th>
                    <button
                      className="btn btn-secondary btn-sm d-flex align-items-center gap-2 mb-1"
                      onClick={() => handleSort("price")}
                    >
                      Sort
                      <img
                        src={
                          sortKey === "price" && sortDirection === "asc"
                            ? "/sort-ascending.png"
                            : "/sort-decending.png"
                        }
                        alt="Sort Icon"
                        width={20}
                        height={20}
                      />
                    </button>
                    Price (USD)
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Price"
                      value={searchPrice}
                      onChange={(e) => setSearchPrice(e.target.value)}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto) => (
                  <tr key={crypto.id}>
                    <td>{crypto.symbol}</td>
                    <td>{crypto.name}</td>
                    <td>${crypto.metrics.market_data.price_usd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col text-start" />
            <div className="col text-center">
              {loading ?    <span className="text-muted">Loading...</span>  : <p> Scroll Down To Load More </p> }
            </div>
            <div className="col text-center">
              {/* <button
                className="btn btn-primary"
                onClick={handleLoadMore}
                disabled={loading}
              >
                Load More
              </button> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
