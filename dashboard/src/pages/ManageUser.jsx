import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Popconfirm, message } from "antd";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

const fontFamily = "'SF Pro Display', 'Poppins', Arial, sans-serif";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
      message.error("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Customer", value: "customer" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <a style={{ color: "red" }}>Delete</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ fontFamily, padding: 20 }}>
      <br />
      <Title level={3}>Manage Users</Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default ManageUser;
