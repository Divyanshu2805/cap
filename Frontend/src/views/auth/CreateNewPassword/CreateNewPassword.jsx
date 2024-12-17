import { useState } from "react";
import apiInstance from "../../../utils/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Toast from "../../pluggin/Toast";
import "./CreateNewPassword.css"; // Add corresponding CSS file for styling
import ThaparLogo from "C:\\Users\\divya\\Desktop\\Capstone\\Frontend\\src\\views\\auth\\assets\\logo.png"; // Update path if needed

function CreateNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  const otp = searchParam.get("otp");
  const uuidb64 = searchParam.get("uuidb64");
  const refresh_token = searchParam.get("refresh_token");

  const handleCreatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (confirmPassword !== password) {
      Toast().fire({
        icon: "warning",
        title: "Passwords do not match",
      });
      return;
    } else {
      const formdata = new FormData();
      formdata.append("password", password);
      formdata.append("otp", otp);
      formdata.append("uuidb64", uuidb64);
      formdata.append("refresh_token", refresh_token);

      try {
        await apiInstance
          .post(`user/password-change/`, formdata)
          .then((res) => {
            console.log(res.data);
            setIsLoading(false);
            navigate("/login");
            Toast().fire({
              icon: "success",
              title: res.data.message,
            });
          });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    console.log("Password Created");
  };

  return (
    <div className="create-password-page">
      <div className="overlay"></div>
      <div className="form-container">
        {/* Thapar Genie Header */}
        <div className="header-container">
          <img src={ThaparLogo} alt="Thapar University Logo" className="thapar-logo" />
        </div>

        <h2 className="form-title">Create New Password</h2>
        <form className="create-password-form" onSubmit={handleCreatePassword}>
          {/* Password Input */}
          <div className="floating-label">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">New Password*</label>
          </div>

          {/* Confirm Password Input */}
          <div className="floating-label">
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder=" "
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="confirm-password">Confirm New Password*</label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewPassword;
