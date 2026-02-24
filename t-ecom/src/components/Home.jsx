import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    console.log(data, "data from home page");
  }, [data]);

  /* ---------------- TOAST AUTO CLOSE ---------------- */
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  /* ---------------- IMAGE HANDLER ---------------- */
  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    if (!base64String) return unplugged;

    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;

    return `data:${mimeType};base64,${base64String}`;
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = (product) => {
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  /* ---------------- FILTER BY CATEGORY ---------------- */
  const filteredProducts = selectedCategory
    ? data.filter((p) => p.category === selectedCategory)
    : data;

  /* ---------------- ERROR STATE ---------------- */
  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <img src={unplugged} alt="Error" width="120" />
          <h4 className="mt-3">Something went wrong</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ---------------- TOAST ---------------- */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div
          className={`toast ${showToast ? "show" : "hide"}`}
          role="alert"
        >
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Added to Cart</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">
            {toastProduct && (
              <div className="d-flex align-items-center">
                <img
                  src={convertBase64ToDataURL(toastProduct.imageData)}
                  alt={toastProduct.name}
                  width="40"
                  height="40"
                  className="me-2 rounded"
                  onError={(e) => (e.target.src = unplugged)}
                />
                <div>
                  <strong>{toastProduct.name}</strong>
                  <br />
                  <small>Added to your cart</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- PRODUCTS GRID ---------------- */}
      <div className="container mt-5 pt-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-12 text-center my-5">
              <h4>No Products Available</h4>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const {
                id,
                brand,
                name,
                price,
                productAvailable,
                imageData,
                stockQuantity,
              } = product;

              return (
                <div className="col" key={id}>
                  <div
                    className={`card h-100 shadow-sm ${
                      !productAvailable ? "bg-light" : ""
                    }`}
                  >
                    {/* CLICKABLE AREA */}
                    <Link
                      to={`/product/${id}`}
                      className="text-decoration-none text-dark"
                    >
                      <img
                        src={convertBase64ToDataURL(imageData)}
                        alt={name}
                        className="card-img-top p-2"
                        style={{ height: "150px", objectFit: "cover" }}
                        onError={(e) => (e.target.src = unplugged)}
                      />
                    </Link>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{name.toUpperCase()}</h5>
                      <p className="card-text text-muted fst-italic">
                        ~ {brand}
                      </p>
                      <hr />

                      <div className="mt-auto">
                        <h5 className="fw-bold">
                          <i className="bi bi-currency-rupee"></i>
                          {price}
                        </h5>

                        {/* ADD TO CART BUTTON */}
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            !productAvailable || stockQuantity === 0
                          }
                        >
                          {stockQuantity !== 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
