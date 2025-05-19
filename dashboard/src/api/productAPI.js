import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/products'; // Replace with your product service URL

export const fetchProducts = () => axios.get(API_BASE);

export const fetchProductById = (id) => axios.get(`${API_BASE}/${id}`);
