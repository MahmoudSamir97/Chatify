import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoExitOutline } from 'react-icons/io5';
import AvatarImg from './../../assets/images/avatar.png';
import axios from 'axios';
import './Setting.css';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';

function Profile() {
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    phoneNumber: '',
    bio: '',
  });

  const { authUser, setAuthUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [changedFields, setChangedFields] = useState({});
  const [fetchAgain, setFetchAgain] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/user/profile', config);

      setImagePreview(data.user.profileImage.secure_url);
      setAuthUser(data.user);
    };
    fetchData();
  }, [fetchAgain]);

  // CONFIG
  const token = localStorage.getItem('token').replace(/^"|"$/g, ''); // Remove surrounding quotes
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setChangedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeImage = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      const form = new FormData();
      form.append('profileImage', file);
      const { data } = await axios.post('/user/profile-image', form, config);
      setAuthUser(data.updatedChat);
      setFetchAgain(!fetchAgain);
      toast.success('Image added successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete('/user/profile-image', config);

      setAuthUser(data.user);

      setFetchAgain(!fetchAgain);

      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setEditLoading(true);
      const res = await axios.patch('/user/profile', changedFields, config);
      if (res.error) throw new Error(res.error);
      setEditLoading(false);
      setAuthUser(res.data.updatedUser);
      setForm({ fullname: '', username: '', phoneNumber: '', bio: '' });
      toast.success('Profile updated successfully');
    } catch (error) {
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.message) {
          toast.error(responseData.message);
        } else if (responseData.errors) {
          const validationError = responseData.errors[0];
          toast.error(validationError.message);
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      }
      setEditLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting bg-dark:bg-slate-800 bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div
          className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12 "
          style={{ height: '30vh' }}
        >
          <h2 className="pl-4 mb-4 text-2xl font-semibold">
            {authUser.username}
          </h2>
          <div className="text-gray-800 max-w-full mb-3 px-4  text-justify break-words bio-container">
            {authUser.bio ? (
              authUser.bio
            ) : (
              <p className="text-gray-600">No bio yet..</p>
            )}
          </div>
          <div className="links-container">
            <Link
              to={'#!'}
              className="flex items-center px-3 py-2.5 mb-2 font-bold bg-white  text-indigo-900 border rounded-full"
            >
              Pubic Profile
            </Link>
            <Link
              to={'/'}
              className=" px-3 py-2.5 font-bold flex items-center text-red-600 hover:text-red-800"
            >
              <IoExitOutline className="text-2xl cursor-pointer font-bold  " />{' '}
              Return
            </Link>
          </div>
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl text-center mb-7">
              Public Profile
            </h2>
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
                    onChange={handleChangeImage}
                    id="image-upload"
                    hidden
                    name="bjh"
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
                      onClick={handleDeleteImage}
                      className="py-3.5 px-7 font-medium text-white focus:outline-none bg-red-600 rounded-lg border border-red-200 hover:bg-red-700 hover:text-white focus:z-10 focus:ring-4 "
                    >
                      Delete picture
                    </button>
                  </div>
                </div>
                {loading && (
                  <div className="text-center mt-2">
                    <div className="loading loading-spinner"></div>
                  </div>
                )}

                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
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
                      name="fullname"
                      className="bg-gray-50 border-gray-300 border text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="Full name"
                      value={form.fullname}
                      onChange={handleChange}
                    />
                  </div>
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
                      name="username"
                      className="bg-gray-50 border-gray-300 border text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="Username"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>
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
                      name="phoneNumber"
                      className="bg-gray-50 border border-gray-300  text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="+20 0000000000"
                      value={form.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
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
                      name="bio"
                      className="block p-2.5 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      value={form.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center">
                    {editLoading ? (
                      <div className="loading loading-spinner"></div>
                    ) : (
                      <button
                        type="submit"
                        className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Profile;
