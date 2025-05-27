import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import {
  Layout,
  Input,
  Badge,
  Card,
  Row,
  Col,
  Slider,
  Checkbox,
  Select,
  Tag,
  Empty,
  Drawer,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import "../pages/Products.css";

const { Header, Content } = Layout;
const { Search } = Input;

const Products = () => {
  const { products } = useContext(ProductContext);
  const [filtered, setFiltered] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    let temp = products;

    if (searchTerm.trim()) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    temp = temp.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
        (!selectedStorage || p.storage === selectedStorage)
    );

    setFiltered(temp);
  }, [searchTerm, priceRange, selectedCategories, selectedStorage, products]);

  return (
    <Layout className="app-layout">
      <div className="search-bar-container">
        <Search
          placeholder="Search gadgets..."
          enterButton
          onSearch={(value) => setSearchTerm(value)}
          className="search-bar"
        />
        <Button
          type="text"
          icon={<FilterOutlined className="filter-icon" />}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      <Drawer
        title="Filter Products"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <h3>Price Range (₱)</h3>
        <Slider
          range
          value={priceRange}
          max={50000}
          step={1000}
          onChange={setPriceRange}
        />

        <h3>Category</h3>
        <Checkbox.Group
          options={["iPhone", "iPad", "MacBook", "Apple Watch"]}
          onChange={setSelectedCategories}
        />

        <h3 style={{ marginTop: "1rem" }}>Storage</h3>
        <Select
          placeholder="Select storage"
          style={{ width: "100%" }}
          onChange={setSelectedStorage}
          allowClear
        >
          <Select.Option value="64GB">64GB</Select.Option>
          <Select.Option value="128GB">128GB</Select.Option>
          <Select.Option value="256GB">256GB</Select.Option>
          <Select.Option value="512GB">512GB</Select.Option>
        </Select>
      </Drawer>

      <Layout className="main-content">
        <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
          {filtered.length ? (
            <Row gutter={[16, 16]}>
              {filtered.map((product, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <div>
                          <p>₱{product.price.toLocaleString()}</p>
                          <Tag color={product.stock > 0 ? "green" : "red"}>
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </Tag>
                          <p>Category: {product.category}</p>
                          <p>Storage: {product.storage}</p>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No matching products found" />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Products;
