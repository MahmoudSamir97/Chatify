import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import signupImage from "../../../assets/images/register.jpg";
import { FaRegEyeSlash } from "react-icons/fa";
import { TbEye } from "react-icons/tb";
import toast from "react-hot-toast";

function Signup() {
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  //   SUBMIT FUNCTION
  const onSubmit = async (values, actions) => {
    try {
      const url = "http://localhost:4000/api/auth/signup";
      const data = await axios.post(url, values);
      console.log(data);
      actions.resetForm();

      toast.success("Please verify your email address");
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        // generic error message
        console.log(error);
        toast.error("Error occured, try with different data");
      }
    }
  };
  // VALIDATION SCHEMA
  const passwordPattern = new RegExp(/^[A-Z][A-Za-z1-9]{5,}[@#$%^&*]{1,}$/);
  const usernamePattern = new RegExp(/^[A-Za-z]{8,}[0-9@#$%^&*]{2,}$/);
  const signupSchema = Yup.object({
    fullname: Yup.string()
      .min(8, "full name can't be less than 8 characters")
      .required("Required"),
    username: Yup.string()
      .matches(usernamePattern, "Username must be unique")
      .required("Required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Required"),
    password: Yup.string()
      .matches(
        passwordPattern,
        "Password must have Uppercase letter and special character"
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password and confirm password must match")
      .required("Required"),
  });
  // FORMIK
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit,
  });

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p className="auth__form-container_fields-title">Sign up</p>

          <form onSubmit={handleSubmit}>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input first-input">
              <label htmlFor="fullname">Full Name</label>
              <input
                className={
                  errors.fullname && touched.fullname ? "input-error" : ""
                }
                name="fullname"
                type="text"
                placeholder="Full Name"
                value={values.fullname}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.fullname && touched.fullname && (
                <p className="error"> {errors.fullname}</p>
              )}
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Username</label>
              <input
                className={
                  errors.username && touched.username ? "input-error" : ""
                }
                name="username"
                type="text"
                placeholder="Username"
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.username && touched.username && (
                <p className="error"> {errors.username}</p>
              )}
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="phoneNumber">Email</label>
              <input
                className={errors.email && touched.email ? "input-error" : ""}
                name="email"
                type="text"
                placeholder="Email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.email && touched.email && (
                <p className="error"> {errors.email}</p>
              )}
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input relative pass-input ">
              <label htmlFor="password">Password</label>
              <div className="relative w-full">
                <input
                  className={
                    errors.password && touched.password ? "input-error" : ""
                  }
                  name="password"
                  style={{ width: "100%" }}
                  type={passVisible ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <span
                  className="inline absolute right-2 bottom-3"
                  onClick={() => setPassVisible((prev) => !prev)}
                >
                  {passVisible ? <TbEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              {errors.password && touched.password && (
                <p className="error"> {errors.password}</p>
              )}
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input pass-input">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative w-full">
                <input
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "input-error"
                      : ""
                  }
                  style={{ width: "100%" }}
                  name="confirmPassword"
                  type={confirmPassVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <span
                  className="inline absolute right-2 bottom-3"
                  onClick={() => setConfirmPassVisible((prev) => !prev)}
                >
                  {confirmPassVisible ? <TbEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="error"> {errors.confirmPassword}</p>
              )}
            </div>
            {/* BUTTONS */}
            <div className="auth__form-container_fields-content_button">
              <button disabled={isSubmitting} type="submit">
                Sign up
              </button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              Already have an account?{" "}
              <Link className="link" to={"/login"}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signupImage} alt="sign up" />
      </div>
    </div>
  );
}

export default Signup;
