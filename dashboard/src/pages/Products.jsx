import React, { useContext, useState, useEffect } from "react";
import { useProductContext } from "../context/ProductContext";
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
  Tag,
  Empty,
  Drawer,
  Button,
  Tooltip,
  Modal as AntModal,
  Pagination,
  Form,
} from "antd";
import {
  ShoppingCartOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "../pages/Products.css";
import ProductCard from "../components/ProductCard";

const { Content } = Layout;
const { Search } = Input;

const categoryOptions = [
  "iPhone",
  "iPad",
  "MacBook",
  "Apple Watch",
  "AirPods",

  "HomePod",
  "Accessories",
];

const Products = () => {
  const { products, deleteProduct, editProduct } = useProductContext();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 300000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    if (!products?.length) return;

    let temp = [...products];

    // Comment out filters for debugging
    // if (searchTerm.trim())
    //   temp = temp.filter((p) =>
    //     p.name.toLowerCase().includes(searchTerm.toLowerCase())
    //   );

    // temp = temp.filter(
    //   (p) =>
    //     p.price >= priceRange[0] &&
    //     p.price <= priceRange[1] &&
    //     (selectedCategories.length === 0 ||
    //       (p.categories || []).some((cat) => selectedCategories.includes(cat)))
    // );

    setFiltered(temp);
    setCurrentPage(1);
  }, [searchTerm, priceRange, selectedCategories, products]);

  const handleEdit = (p) => {
    setEditValues({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      categories: (p.categories || []).join(", "),
    });
    setEditModalOpen(true);
  };

  const handleChange = (e) =>
    setEditValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    await editProduct(editValues._id, {
      ...editValues,
      price: Number(editValues.price) || 0,
      stock: Number(editValues.stock) || 0,
      categories: editValues.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    });
    setEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?"))
      await deleteProduct(id);
  };

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filtersActive =
    selectedCategories.length > 0 ||
    priceRange[0] !== 1000 ||
    priceRange[1] !== 300000;

  return (
    <Layout className="app-layout">
      <br /><br /><br />
      <div className="search-bar-container" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Search
          placeholder="Search for gadgets..."
          enterButton
          onSearch={setSearchTerm}
          className="search-bar"
          allowClear
        />

        <Button
          type="text"
          icon={<FilterOutlined />}
          onClick={() => setDrawerVisible(true)}
        />

        {filtersActive && (
          <Button
            onClick={() => {
              setSelectedCategories([]);
              setPriceRange([1000, 300000]);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {filtersActive && (
        <div style={{ margin: "1rem 0", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {(priceRange[0] !== 1000 || priceRange[1] !== 300000) && (
            <Tag color="blue">
              Price: ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
            </Tag>
          )}

          {selectedCategories.map((cat) => (
            <Tag color="green" key={cat}>{cat}</Tag>
          ))}
        </div>
      )}

      <Drawer
  title="Filter Apple Products"
  placement="right"
  onClose={() => setDrawerVisible(false)}
  open={drawerVisible}
>
  <h3>Price Range (₱)</h3>
  <Slider
    range
    min={1000}
    max={300000}
    step={1000}
    value={priceRange}
    onChange={setPriceRange}
  />

  <h3>Apple Products</h3>
  <Checkbox.Group
    options={categoryOptions}
    value={selectedCategories}
    onChange={setSelectedCategories}
    style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 18 }}
  />
</Drawer>

      <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
        {paginated.length ? (
          <Row gutter={[16, 16]}>
            {paginated.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
                {isAdmin ? (
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={p.name}
                        src={
                          p.imageUrl?.startsWith("data:")
                            ? p.imageUrl
                            : `data:image/jpeg;base64,${p.imageUrl}`
                        }
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    }
                    actions={[
                      <Tooltip title="Edit" key="edit">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(p)} type="link" />
                      </Tooltip>,
                      <Tooltip title="Delete" key="delete">
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(p._id)}
                          type="link"
                          danger
                        />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      title={p.name}
                      description={
                        <>
                          <p>₱{p.price?.toLocaleString()}</p>
                          <Tag color={p.stock > 0 ? "green" : "red"}>
                            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </Tag>
                          <p>Category: {(p.categories || []).join(", ") || "N/A"}</p>
                        </>
                      }
                    />
                  </Card>
                ) : (
                  <ProductCard {...p} />
                )}
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No matching products found" />
        )}

        {filtered.length > pageSize && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filtered.length}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </Content>

      <AntModal
        title="Edit Product"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Form layout="vertical">
          {["name", "description", "price", "stock", "imageUrl", "categories"].map((field) => (
            <Form.Item key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
              {field === "categories" ? (
                <Input
                  name={field}
                  value={editValues[field]}
                  onChange={handleChange}
                />
              ) : field === "price" || field === "stock" ? (
                <Input
                  name={field}
                  type="number"
                  value={editValues[field]}
                  onChange={handleChange}
                />
              ) : (
                <Input
                  name={field}
                  value={editValues[field]}
                  onChange={handleChange}
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </AntModal>
    </Layout>
  );
};

export default Products;
