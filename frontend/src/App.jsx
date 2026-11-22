import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
function App() {


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
