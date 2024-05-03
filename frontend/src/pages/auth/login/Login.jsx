import React, { useState } from 'react';
import { useFormik } from 'formik';
import signinImage from '../../../assets/images/register.jpg';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from 'react-icons/fa';
import { TbEye } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../../context/AuthContext';

function Signin() {
  const [passVisible, setPassVisible] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    try {
      const url = 'http://localhost:4000/api/auth/login';
      const { data } = await axios.post(url, values);
      localStorage.setItem('chat-user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
      setAuthUser(data.user);
      actions.resetForm();
      navigate('/');
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage) {
        console.log(error.response.data);
        toast.error(errorMessage);
      } else {
        toast.error('Error occurred, try with different data');
      }
    }
  };

  const { values, isSubmitting, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
  });

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p className="auth__form-container_fields-title">Sign in</p>
          <form onSubmit={handleSubmit}>
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div className="auth__form-container_fields-content_input pass-input">
              <label htmlFor="password">Password</label>
              <div className="relative w-full">
                <input
                  name="password"
                  type={passVisible ? 'text' : 'password'}
                  style={{ width: '100%' }}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
                <span
                  className="inline absolute right-2 bottom-3"
                  onClick={() => setPassVisible((prev) => !prev)}>
                  {passVisible ? <TbEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              <Link
                className="text-blue-700 text-sm inline hover:text-blue-400"
                to={'/forget-password'}>
                Forget your password?
              </Link>
            </div>
            <div className="auth__form-container_fields-content_button">
              <button disabled={isSubmitting} type="submit">
                Sign in
              </button>
            </div>
          </form>
          <div className="auth__form-container_fields-account login-text">
            <p>
              Don't have an account?{' '}
              <Link className="link" to={'/signup'}>
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
