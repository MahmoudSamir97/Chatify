import React, { useState } from "react";
import { useFormik } from "formik";
import signinImage from "../../../assets/images/register.jpg";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { TbEye } from "react-icons/tb";

function Signin() {
  const [error, setError] = useState(null);
  const [passVisible, setPassVisible] = useState(false);

  //   SUBMIT FUNCTION
  const onSubmit = async (values, actions) => {
    try {
      const BASE_URL = "http://localhost:4000";
      const {
        data: { token, userID, username, fullname },
      } = await axios.post(`${BASE_URL}/auth/signin`, values);
      setError(null);
      actions.resetForm();
    } catch (error) {
      setError("Invalid username or password");
      console.log(error);
    }
  };

  // FORMIK
  const { values, isSubmitting, handleChange, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p className="auth__form-container_fields-title">Sign in</p>
          <form onSubmit={handleSubmit}>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input pass-input">
              <label htmlFor="password">Password</label>
              <div className="relative w-full">
                <input
                  name="password"
                  type={passVisible ? "text" : "password"}
                  style={{ width: "100%" }}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
                <span
                  className="inline absolute right-2 bottom-3"
                  onClick={() => setPassVisible((prev) => !prev)}
                >
                  {passVisible ? <TbEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              {error && <p className="invalid_us_pas">{error}</p>}
            </div>
            <div className="auth__form-container_fields-content_button">
              <button disabled={isSubmitting} type="submit">
                Sign in
              </button>
            </div>
          </form>
          <div className="auth__form-container_fields-account login-text">
            <p>
              Don't have an account?{" "}
              <Link className="link" to={"/signup"}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} alt="sign in" />
      </div>
    </div>
  );
}

export default Signin;
