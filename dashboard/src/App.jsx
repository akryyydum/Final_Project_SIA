import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import ManageUser from './pages/ManageUser';
import CheckoutList from './pages/CheckoutList';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/admin/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute><CheckoutList /></PrivateRoute>} />
            <Route path="/users" element={<ManageUser />} />
          </Routes>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
