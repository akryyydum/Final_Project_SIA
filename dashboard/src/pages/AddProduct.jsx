import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../pages/AddProduct.css";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (values) => {
    const imageFile = values.image.file.originFileObj;

    if (imageFile.size > 2 * 1024 * 1024) {
      message.error("Image too large (max 2MB)");
      return;
    }

    const imageBase64 = await convertToBase64(imageFile);

    const product = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      stock: parseInt(values.stock, 10),
      imageUrl: imageBase64,
      categories: [values.category],
      tags: values.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await addProduct(product);
      message.success("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error("Failed to add product:", err);
      message.error("Failed to add product");
    }
  };

  return (
    <div className="add-product-wrapper">
      <h1>Add Product</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="add-product-form"
      >
        <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="e.g. iPhone 15 Pro" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 999.99" />
        </Form.Item>

        <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 25" />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Input placeholder="e.g. Electronics" />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Input placeholder="e.g. smartphone, android, 5G" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;