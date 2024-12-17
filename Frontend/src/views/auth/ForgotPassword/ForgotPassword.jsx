import { useState } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../../utils/axios";
import "./ForgotPassword.css"; // Add corresponding CSS file for styling
import ThaparLogo from "C:\\Users\\divya\\Desktop\\Capstone\\Frontend\\src\\views\\auth\\assets\\logo.png"; // Update path if necessary

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
        console.log(res.data);
        setIsLoading(false);
        alert("Password Reset Email Sent");
      });
    } catch (error) {
      console.log("error: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="overlay"></div>
      <div className="form-container">
        {/* Thapar Genie Header */}
        <div className="header-container">
          <img src={ThaparLogo} alt="Thapar University Logo" className="thapar-logo" />
        </div>

        <h2 className="form-title">Forgot Password</h2>
        <p className="form-subtext">
          Enter your email to reset your password.
        </p>

        <form className="forgot-password-form" onSubmit={handleEmailSubmit}>
          {/* Email Input */}
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

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        <p className="redirect-text">
          Remember your password? <Link to="/login" className="redirect-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
