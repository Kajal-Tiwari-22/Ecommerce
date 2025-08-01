import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MAX_LIMIT = 5; // Maximum stock per product

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState({});
  const componentMounted = useRef(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    const currentCount = cartCount[product.id] || 0;

    if (currentCount >= MAX_LIMIT) {
      toast.error("This product is out of stock!");
      return;
    }

    dispatch(addCart(product));
    setCartCount((prev) => ({ ...prev, [product.id]: currentCount + 1 }));

    if (currentCount + 1 === MAX_LIMIT) {
      toast.error("Reached stock limit. Product now out of stock!");
    } else {
      toast.success("Added to cart");
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      const products = await response.json();

      if (componentMounted.current) {
        setData(products);
        setFilter(products);
        setLoading(false);
      }
    };

    getProducts();
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {[...Array(6)].map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </>
  );

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => (
    <>
      <div className="buttons text-center py-5">
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(data)}>
          All
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>
          Men's Clothing
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>
          Women's Clothing
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>
          Jewelery
        </button>
        <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>
          Electronics
        </button>
      </div>

      {filter.map((product) => {
        const count = cartCount[product.id] || 0;
        const isOutOfStock = count >= MAX_LIMIT;

        return (
          <div key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <div className="card text-center h-100">
              <img className="card-img-top p-3" src={product.image} alt="Card" height={300} />
              <div className="card-body">
                <h5 className="card-title">{product.title.substring(0, 12)}...</h5>
                <p className="card-text">{product.description.substring(0, 90)}...</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead">$ {product.price}</li>
              </ul>
              <div className="card-body">
                <Link to={`/product/${product.id}`} className="btn btn-dark m-1">
                  Buy Now
                </Link>
                {isOutOfStock ? (
                  <>
                    <button className="btn btn-secondary m-1" disabled>
                      Out of Stock
                    </button>
                    <Link to={`/similar-products/${product.id}`} className="btn btn-outline-primary m-1">
                      Show Similar
                    </Link>
                  </>
                ) : (
                  <button className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">{loading ? <Loading /> : <ShowProducts />}</div>
    </div>
  );
};

export default Products;
