import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  /* -------------------- CLOSE NAVBAR ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- THEME HANDLING -------------------- */
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  /* -------------------- SEARCH SUBMIT -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);

    try {
      const response = await axios.get(
        `${baseUrl}/api/products/search?keyword=${input}`
      );

      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
      } else {
        navigate("/search-results", {
          state: { searchData: response.data },
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- NAVBAR HELPERS -------------------- */
  const handleNavbarToggle = () => setIsNavCollapsed(!isNavCollapsed);
  const handleLinkClick = () => setIsNavCollapsed(true);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-white shadow-sm"
      ref={navbarRef}
    >
      <div className="container-fluid">
        {/* BRAND (external link is OK) */}
        <a
          className="navbar-brand"
          href="https://dakshin-portfolio.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          Dakshin Ghai
        </a>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV CONTENT */}
        <div className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/add_product"
                onClick={handleLinkClick}
              >
                Add Product
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/orders"
                onClick={handleLinkClick}
              >
                Orders
              </Link>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-2">
            {/* THEME */}
            <button className="btn btn-outline-secondary" onClick={toggleTheme}>
              <i
                className={`bi ${
                  theme === "dark-theme" ? "bi-moon-fill" : "bi-sun-fill"
                }`}
              />
            </button>

            {/* CART */}
            <Link
              to="/cart"
              className="nav-link text-dark"
              onClick={handleLinkClick}
            >
              <i className="bi bi-cart me-1"></i> Cart
            </Link>

            {/* SEARCH */}
            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                className="btn btn-outline-success"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Search"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* NO PRODUCTS MESSAGE */}
        {showNoProductsMessage && (
          <div
            className="alert alert-warning position-absolute mt-2"
            style={{ top: "100%", right: 20, zIndex: 1000 }}
          >
            No products found.
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
