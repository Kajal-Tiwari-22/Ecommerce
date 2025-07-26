import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import productStockCategory from "../data/productStockCategory";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const productId = String(id);
  const stockLimit = productStockCategory[productId]?.stock || 3;
  const [cartCount, setCartCount] = useState(0);

  const addProduct = (prod) => {
    if (cartCount >= stockLimit) {
      // ✅ Pass actual product category from API, not mapping file
      navigate(`/similar-products/${encodeURIComponent(prod.category)}`, {
        state: {
          outOfStockProductId: Number(prod.id),
          category: prod.category
        }
      });
    } else {
      setCartCount(cartCount + 1);
      dispatch(addCart(prod));
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };
    getProduct();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container">
        {loading ? (
          <Skeleton height={400} />
        ) : (
          <div className="row my-5">
            <div className="col-md-6">
              <img className="img-fluid" src={product.image} alt={product.title} />
            </div>
            <div className="col-md-6">
              <h4>{product.category}</h4>
              <h1>{product.title}</h1>
              <h3>${product.price}</h3>
              <p>{product.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                {cartCount >= stockLimit ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;
