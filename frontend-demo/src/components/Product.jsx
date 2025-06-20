import React from "react";
import axios from "axios";

const Product = ({ data }) => {
    return (
        <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{data.symbol}</h5>
                <p className="card-text">Price: {data.metrics.market_data.price_usd}</p>
                <a href="#" className="btn btn-primary">Buy</a>
            </div>
        </div>
    );
};

export default Product;
