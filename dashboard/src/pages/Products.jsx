import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
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
  Tooltip,
  Modal as AntModal,
} from "antd";
import {
  ShoppingCartOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "../pages/Products.css";
import ProductCard from "../components/ProductCard";

const { Header, Content } = Layout;
const { Search } = Input;

const categoryOptions = ["iPhone", "iPad", "MacBook", "Apple Watch"];

const storageOptions = [
  { label: "64GB", value: "64GB" },
  { label: "128GB", value: "128GB" },
  { label: "256GB", value: "256GB" },
  { label: "512GB", value: "512GB" },
];

const Products = () => {
  const { products, deleteProduct, editProduct } = useContext(ProductContext);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categories: "",
    storage: "",
  });

  useEffect(() => {
    if (!products || products.length === 0) return;

    let temp = [...products];

    if (searchTerm.trim()) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    temp = temp.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (selectedCategories.length === 0 ||
          (p.categories || []).some((cat) => selectedCategories.includes(cat))) &&
        (!selectedStorage || p.storage === selectedStorage)
    );

    setFiltered(temp);
  }, [searchTerm, priceRange, selectedCategories, selectedStorage, products]);

  const handleEdit = (product) => {
    setEditValues({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categories: (product.categories || []).join(", "),
      storage: product.storage || "",
    });
    setEditModalOpen(true);
  };

  const handleChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await editProduct(editValues._id, {
      ...editValues,
      price: Number(editValues.price) || 0,
      stock: Number(editValues.stock) || 0,
      categories: editValues.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      storage: editValues.storage,
    });
    setEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <Layout className="app-layout">
      <Header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <Badge count={3}>
          <ShoppingCartOutlined className="cart-icon" />
        </Badge>
      </Header>

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
          options={categoryOptions}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />

        <h3 style={{ marginTop: "1rem" }}>Storage</h3>
        <Select
          placeholder="Select storage"
          style={{ width: "100%" }}
          value={selectedStorage}
          onChange={setSelectedStorage}
          allowClear
        >
          {storageOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Drawer>

      <Layout className="main-content">
        <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
          {filtered.length ? (
            <Row gutter={[16, 16]}>
              {filtered.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  {isAdmin ? (
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.name}
                          src={
                            product.imageUrl?.startsWith("data:")
                              ? product.imageUrl
                              : `data:image/jpeg;base64,${product.imageUrl}`
                          }
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      }
                      actions={[
                        <Tooltip title="Edit" key="edit">
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(product)}
                            type="link"
                          />
                        </Tooltip>,
                        <Tooltip title="Delete" key="delete">
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(product._id)}
                            type="link"
                            danger
                          />
                        </Tooltip>,
                      ]}
                    >
                      <Card.Meta
                        title={product.name}
                        description={
                          <>
                            <p>₱{product.price?.toLocaleString()}</p>
                            <Tag color={product.stock > 0 ? "green" : "red"}>
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </Tag>
                            <p>
                              Category:{" "}
                              {(product.categories || []).join(", ") || "N/A"}
                            </p>
                            <p>Storage: {product.storage || "N/A"}</p>
                          </>
                        }
                      />
                    </Card>
                  ) : (
                    <ProductCard {...product} />
                  )}
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No matching products found" />
          )}
        </Content>
      </Layout>

      <AntModal
        title="Edit Product"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Input
          placeholder="Name"
          name="name"
          value={editValues.name}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Description"
          name="description"
          value={editValues.description}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Price"
          name="price"
          type="number"
          value={editValues.price}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Stock"
          name="stock"
          type="number"
          value={editValues.stock}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Image URL or Base64"
          name="imageUrl"
          value={editValues.imageUrl}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Categories (comma separated)"
          name="categories"
          value={editValues.categories}
          onChange={handleChange}
          style={{ marginBottom: 8 }}
        />
        <Select
          placeholder="Storage"
          value={editValues.storage}
          onChange={(value) =>
            setEditValues((prev) => ({ ...prev, storage: value }))
          }
          style={{ width: "100%" }}
          allowClear
        >
          {storageOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </AntModal>
    </Layout>
  );
};

export default Products;
