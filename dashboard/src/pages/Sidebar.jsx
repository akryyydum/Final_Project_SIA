import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="filter-group">
        <h4>Price</h4>
        <input type="range" min="0" max="1000" />
      </div>
      <div className="filter-group">
        <h4>Brands</h4>
        {["Apple", "Samsung", "Xiaomi"].map((brand, i) => (
          <label key={i}>
            <input type="checkbox" /> {brand}
          </label>
        ))}
      </div>
      <div className="filter-group">
        <h4>Memory</h4>
        {["128GB", "256GB", "512GB"].map((mem, i) => (
          <label key={i}>
            <input type="checkbox" /> {mem}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
