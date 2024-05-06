import React, { useState } from 'react';
import chatImg from '../../../assets/images/chat.png';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaRegEyeSlash } from 'react-icons/fa';
import { TbEye } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = `http://localhost:4000/api/auth/reset-password/${id}/${token}`;
      const res = await axios.post(URL, {
        newPassword,
        confirmNewPassword,
      });
      if (res.error) throw new Error(res.error);
      toast.success('Password resetted successfully');
      setTimeout(() => navigate('/login'), 2300);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        // Check if the error response contains a specific message
        if (responseData.message) {
          // Display specific error message
          toast.error(responseData.message);
        }
        // Check if the error response contains validation errors
        else if (responseData.errors) {
          // Display validation errors
          const validationError = responseData.errors[0];
          toast.error(validationError.message);
        }
        //  display generic error message
        else {
          toast.error('An error occurred. Please try again later.');
        }
      }
    }
  };

  return (
    <section className="reset-main-container">
      <main
        id="content"
        role="main"
        className=" main w-full h-screen max-w-md p-6 mx-auto"
      >
        <div className="bg-white border shadow-lg mt-7 rounded-xl">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <div className="flex items-end justify-center mb-8 text-2xl font-bold">
                Chatify
                <span className="text-indigo-600 ms-2">
                  <img src={chatImg} alt="logo" width={30} />
                </span>
              </div>
              <h1 className="block text-lg font-bold text-gray-800">
                Reset Password
              </h1>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="new_password"
                      className="block mb-2 ml-1 text-xs font-semibold "
                    >
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={passVisible ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        id="new_password"
                        name="newPassword"
                        className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        aria-describedby="new-password-error"
                        placeholder="Enter a new password"
                      />
                      <span
                        className="inline absolute right-2 bottom-4"
                        onClick={() => setPassVisible((prev) => !prev)}
                      >
                        {passVisible ? <TbEye /> : <FaRegEyeSlash />}
                      </span>
                    </div>
                    <p
                      className="hidden mt-2 text-xs text-red-600"
                      id="new-password-error"
                    >
                      Please include a password that complies with the rules to
                      ensure security
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="confirmn_new_password"
                      className="block mb-2 ml-1 text-xs font-semibold "
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type={confirmPassVisible ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        id="confirmn_new_password"
                        name="confirmNewPassword"
                        className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        aria-describedby="confirmn_new-password-error"
                        placeholder="Enter a new password"
                      />
                      <span
                        className="inline absolute right-2 bottom-4 "
                        onClick={() => setConfirmPassVisible((prev) => !prev)}
                      >
                        {confirmPassVisible ? <TbEye /> : <FaRegEyeSlash />}
                      </span>
                    </div>
                    <p
                      className="hidden mt-2 text-xs text-red-600"
                      id="confirmn_new-password-error"
                    >
                      Please include a password that complies with the rules to
                      ensure security
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-all bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Reset my password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default ResetPassword;
