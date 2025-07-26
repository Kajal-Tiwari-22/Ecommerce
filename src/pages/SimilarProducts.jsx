import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useParams, useLocation, Link } from "react-router-dom";

const SimilarProducts = () => {
  const { category } = useParams();
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [outOfStockProduct, setOutOfStockProduct] = useState(null);

  const outOfStockProductId = location.state?.outOfStockProductId || null;
  const actualCategory = location.state?.category || category;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("https://fakestoreapi.com/products/");
      const products = await res.json();

      const outOfStock = products.find(p => p.id === outOfStockProductId);
      setOutOfStockProduct(outOfStock);

      const filtered = products.filter(
        p => p.category === actualCategory && p.id !== outOfStockProductId
      );

      setFilteredProducts(filtered);
    };

    fetchProducts();
  }, [actualCategory, outOfStockProductId]);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">
          Similar Products in "
          {outOfStockProduct ? outOfStockProduct.category : actualCategory}"
        </h1>
        <hr />
        <div className="row justify-content-center">
          {filteredProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            filteredProducts.map(product => (
              <div
                id={product.id}
                key={product.id}
                className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
              >
                <div className="card text-center h-100">
                  <img
                    className="card-img-top p-3"
                    src={product.image}
                    alt={product.title}
                    height={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p className="card-text">
                      {product.description.substring(0, 90)}...
                    </p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">$ {product.price}</li>
                  </ul>
                  <div className="card-body">
                    <Link
                      to={"/product/" + product.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimilarProducts;
