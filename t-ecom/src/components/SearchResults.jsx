import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert base64 to image URL
  const convertBase64ToDataURL = (base64, mimeType = "image/jpeg") => {
    if (!base64) return "/placeholder.png";
    if (base64.startsWith("data:") || base64.startsWith("http")) {
      return base64;
    }
    return `data:${mimeType};base64,${base64}`;
  };

  useEffect(() => {
    if (location.state?.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      // If user refreshes or opens directly
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (id) => {
    toast.success(`Product ${id} added to cart`);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-3">Search Results</h2>

      {searchData.length === 0 ? (
        <div className="alert alert-info">No products found.</div>
      ) : (
        <>
          <p className="text-muted">
            {searchData.length} product(s) found
          </p>

          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            {searchData.map((product) => (
              <div className="col" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={convertBase64ToDataURL(product.imageData)}
                    className="card-img-top p-3"
                    alt={product.name}
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    onClick={() => handleViewProduct(product.id)}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5>{product.name}</h5>
                    <p className="text-muted mb-1">{product.brand}</p>

                    <span className="badge bg-secondary mb-2">
                      {product.category}
                    </span>

                    <p className="small">
                      {product.description.length > 100
                        ? product.description.substring(0, 100) + "..."
                        : product.description}
                    </p>

                    <h5 className="text-primary mt-auto">
                      ₹{product.price.toLocaleString("en-IN")}
                    </h5>

                    <div className="d-flex justify-content-between mt-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        View
                      </button>

                      <button
                        className="btn btn-primary btn-sm"
                        disabled={
                          !product.productAvailable ||
                          product.stockQuantity <= 0
                        }
                        onClick={() => handleAddToCart(product.id)}
                      >
                        {product.productAvailable &&
                        product.stockQuantity > 0
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
