import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const navigate = useNavigate();

  const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleChange = async (value) => {
    setInput(value);

    if (value.trim().length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setShowSearchResults(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && input.trim()) {
      navigate("/search", {
        state: { keyword: input }
      });
      setShowSearchResults(false);
    }
  };

  const handleSuggestionClick = (id) => {
    setShowSearchResults(false);
    setInput("");
    navigate(`/product/${id}`);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Dakshin
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/add_product">
                  Add Product
                </Link>
              </li>

              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </button>

                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => onSelectCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button className="theme-btn me-3" onClick={toggleTheme}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <Link to="/cart" className="nav-link me-3">
              <i className="bi bi-cart"> Cart</i>
            </Link>

            {/* SEARCH */}
            <div className="position-relative">
              <input
                className="form-control"
                type="search"
                placeholder="Search products..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />

              {showSearchResults && (
                <ul className="list-group position-absolute w-100 z-3">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSuggestionClick(result.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {result.name}
                      </li>
                    ))
                  ) : (
                    noResults && (
                      <li className="list-group-item text-muted">
                        No products found
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
