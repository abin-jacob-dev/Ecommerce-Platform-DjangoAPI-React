import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, finishAuthInitialization } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProducts from "./pages/MyProducts";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";


function App() {
  const { accessToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (accessToken) {

      dispatch(fetchProfile(accessToken))
    } else {
      dispatch(finishAuthInitialization())
    }
  }, [accessToken, dispatch])

  return (

    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="my_products" element={<MyProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>

  )
}

export default App
