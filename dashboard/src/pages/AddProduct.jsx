import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { Form, Input, InputNumber, Upload, Button, message, Typography, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../pages/AddProduct.css";

const { Title } = Typography;

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (values) => {
    let imageFile;
    if (values.image && Array.isArray(values.image.fileList) && values.image.fileList.length > 0) {
      imageFile = values.image.fileList[0].originFileObj;
    } else {
      message.error("Please upload an image.");
      return;
    }

    if (!imageFile) {
      message.error("Please upload an image.");
      return;
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      message.error("Image too large (max 2MB)");
      return;
    }

    setSubmitting(true);
    try {
      const imageBase64 = await convertToBase64(imageFile);

      const product = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        imageUrl: imageBase64,
        categories: [values.category],
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : [],
      };

      await addProduct(product);
      message.success("Product added successfully!");
      form.resetFields();
      navigate("/products");
    } catch (err) {
      console.error("Failed to add product:", err);
      message.error("Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-wrapper">
      <Card className="add-product-card">
        <Title level={2} className="add-product-title">Add Product</Title>
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
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;
