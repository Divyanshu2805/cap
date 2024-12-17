import { useEffect } from "react";
import { logout } from "../../../utils/auth";
import { Link } from "react-router-dom";
import "./Logout.css"; // Add corresponding CSS file for styling
import ThaparLogo from "../assets/logo.png"; // Adjust path if necessary

function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="logout-page">
      <div className="overlay"></div>
      <div className="form-container">
        {/* Thapar Genie Header */}
        <div className="header-container">
          <img src={ThaparLogo} alt="Thapar University Logo" className="thapar-logo" />
        </div>

        <h2 className="form-title">Logged out</h2>
        <p className="form-subtext">
          Thanks for visiting! We hope to see you again soon.
        </p>

        <div className="button-container">
          <Link to="/login" className="btn btn-primary">
            Sign In <i className="fas fa-sign-in-alt"></i>
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register <i className="fas fa-user-plus"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Logout;
