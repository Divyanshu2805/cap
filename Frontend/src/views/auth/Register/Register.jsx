import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../utils/auth";
import "./Register.css";
import ThaparLogo from "../assets/logo.png";

function Register() {
  const [step, setStep] = useState(1); // Manage steps
  const [email, setEmail] = useState(""); // Step 1 field
  const [firstName, setFirstName] = useState(""); // Step 2 field
  // const [lastName, setLastName] = useState(""); // Step 2 field
  const [password, setPassword] = useState(""); // Step 2 field
  const [password2, setPassword2] = useState(""); // Step 2 field
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address.");
    } else {
      setStep(2); // Move to step 2
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(firstName, lastName, email, password, password2);
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      alert("Registration Successful, you have now been logged in");
      navigate("/");
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="overlay"></div>
      <div className="form-container">
        {/* Thapar Genie Header */}
        <div className="header-container">
          <img src={ThaparLogo} alt="Thapar University Logo" className="thapar-logo" />
        </div>

        {step === 1 ? (
          <>
            <h2 className="form-title">Create you account</h2>
            <p className="form-subtext">
              Already have an account?{" "}
              <Link to="/login" className="form-link">
                Sign In
              </Link>
            </p>
            <form onSubmit={handleNextStep}>
              {/* Email */}
              <div className="floating-label">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email Address*</label>
              </div>

              {/* Next Button */}
              <button type="submit" className="submit-btn">
                Continue
              </button>
            </form>

          </>
        ) : (
          <>
            <h2 className="form-title">Create your account</h2>
            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="floating-label">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder=" "
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor="first_name">Full Name*</label>
              </div>

              {/* Last Name */}
              {/* <div className="floating-label">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder=" "
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="last_name">Last Name*</label>
              </div> */}

              {/* Password */}
              <div className="floating-label">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password*</label>
              </div>

              {/* Confirm Password */}
              {/* <div className="floating-label">
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder=" "
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <label htmlFor="confirm_password">Confirm Password*</label>
              </div> */}

              {/* Submit Button */}
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Processing..." : "Register"} <i className="fas fa-user-plus"></i>
              </button>
            </form>
            <button onClick={() => setStep(1)} className="submit-btn back-btn">
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
