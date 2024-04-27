import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import AvatarImg from "./../../assets/images/avatar.png";
import axios from "axios";
import "./Setting.css";
import toast from "react-hot-toast";

function Setting() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    phoneNumber: "",
    bio: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setFormData({ ...formData, profilePic: file });
    setImagePreview(URL.createObjectURL(file));
  };
  //   SUBMIT
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formDataFormat = new FormData();
      // Iterate over formData entries and append them to formData
      for (const key in formData) {
        formDataFormat.append(key, formData[key]);
      }
      console.log(formData, "formData");
      console.log(formDataFormat, "formDataFormat");
      const URL = "http://localhost:4000/api/user/update-profile";
      // TOKEN CONFIG (localstorage)
      const token = localStorage.getItem("token").replace(/^"|"$/g, ""); // Remove surrounding quotes
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // TOKEN CONFIG (localstorage)
      const res = await axios.post(URL, formData, config);
      if (res.error) throw new Error(res.error);
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
          toast.error("An error occurred. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="setting bg-dark:bg-slate-800 bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      {/* SIDEBAR */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div
          className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12 "
          style={{ height: "30vh" }}
        >
          <h2 className="pl-4 mb-4 text-2xl font-semibold">Mahmoudsamir97</h2>
          <div className="text-gray-800 max-w-full mb-3 px-4  text-justify break-words bio-container">
            Hi, my name is mahmoud samir sayed , Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Nobis, inventore qui. Illo dolorum
            quisquam cupiditate voluptates, saepe id rerum quae.
          </div>
          <div className="links-container">
            <Link
              to={"#!"}
              className="flex items-center px-3 py-2.5 mb-2 font-bold bg-white  text-indigo-900 border rounded-full"
            >
              Pubic Profile
            </Link>
            <Link
              to={"/"}
              className=" px-3 py-2.5 font-bold flex items-center text-red-600 hover:text-red-800"
            >
              <IoExitOutline className="text-2xl cursor-pointer font-bold  " />{" "}
              Return
            </Link>
          </div>
        </div>
      </aside>
      {/* MAIN */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl text-center mb-7">
              Public Profile
            </h2>
            {/*FORM  */}
            <form onSubmit={handleSubmit}>
              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={imagePreview || AvatarImg}
                    alt="Bordered avatar"
                  />
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    id="image-upload"
                    hidden
                    accept="image/png, image/jpeg"
                  />

                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button
                      type="button"
                      onClick={() => inputRef.current.click()}
                      className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                    >
                      Change picture
                    </button>
                    <button
                      type="button"
                      className="py-3.5 px-7 font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-200 hover:bg-red-700 hover:text-white focus:z-10 focus:ring-4 "
                    >
                      Delete picture
                    </button>
                  </div>
                </div>
                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                  {/* SINGLE INPUT */}
                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      className="bg-gray-50 border-gray-300 border text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="Full name"
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                    />
                  </div>
                  {/* SINGLE INPUT */}
                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="bg-gray-50 border-gray-300 border text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  {/* SINGLE INPUT */}
                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="bg-gray-50 border border-gray-300  text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="+20 0000000000"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* SINGLE INPUT */}
                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="bio"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                  {/* BUTTON */}
                  <div className="flex justify-center">
                    {loading ? (
                      <div className="loading loading-spinner"></div>
                    ) : (
                      <button
                        type="submit"
                        className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                      >
                        Save
                      </button>
                    )}
                    {/* BUTTON */}
                  </div>
                </div>
              </div>
            </form>
            {/* FORM */}
          </div>
        </div>
      </main>
    </div>
  );
}
export default Setting;
