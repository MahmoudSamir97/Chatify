import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import signupImage from "../../assets/images/register.jpg";

function Signup() {
  //   SUBMIT FUNCTION
  const onSubmit = async (values, actions) => {
    try {
      const BASE_URL = "http://localhost:4000";
      const {
        data: { token, userID, password },
      } = await axios.post(`${BASE_URL}/auth/signup`, values);
      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };
  // VALIDATION SCHEMA
  const passwordPattern = new RegExp(/^[A-Z][A-Za-z1-9]{5,}[@#$%^&*]{1,}$/);
  const signupSchema = Yup.object({
    fullname: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Required"),
    avatarURL: Yup.string().required("Required"),
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
      avatarURL: "",
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
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                className={
                  errors.password && touched.password ? "input-error" : ""
                }
                name="password"
                type="password"
                placeholder="Password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password && touched.password && (
                <p className="error"> {errors.password}</p>
              )}
            </div>
            {/* SINGLE INPUT */}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "input-error"
                    : ""
                }
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
              />
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
