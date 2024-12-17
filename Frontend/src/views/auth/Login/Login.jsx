import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../utils/auth";
import "./Login.css"; // Add corresponding CSS file for styling
import ThaparLogo from "../assets/logo.png"; // Update path if necessary

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(email, password);
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/chat");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <div className="form-container">
        {/* Thapar Genie Header */}
        <div className="header-container">
          <img src={ThaparLogo} alt="Thapar University Logo" className="thapar-logo" />
        </div>

        <h2 className="form-title">Sign In</h2>
        <p className="form-subtext">
          Don’t have an account?{" "}
          <Link to="/register" className="form-link">
            Create
          </Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="floating-label">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email Address*</label>
          </div>

          {/* Password */}
          <div className="floating-label">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password*</label>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="options-container">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Log In "} 
            <i className="fas fa-sign-in-alt"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
