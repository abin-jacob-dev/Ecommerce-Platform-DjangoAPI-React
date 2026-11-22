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


function App() {
  const { accessToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (accessToken) {

      dispatch(fetchProfile(accessToken))
    } else {
      dispatch(finishAuthInitialization())
    }
  }, [accessToken])

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="my_products" element={<MyProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
