import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ m: 2 }}>Manage Users</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user._id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(user._id)} color="error" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ManageUser;