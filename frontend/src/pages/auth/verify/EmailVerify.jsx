import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import success from './../../../assets/images/success.png';
import './EmailVerify.css';
import instance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const params = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        await instance.get(`/auth/${params.id}/verify/${params.token}`);

        toast.success('Email verified successfully');

        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);

        toast.error(error.message);
      }
    };
    verifyEmailUrl();
  }, [params]);

  return (
    <div className="container">
      {validUrl ? (
        <div className="flex-col justify-center items-center">
          <img src={success} alt="success_img" className="success_img" />
          <Link to="/login">
            <button className="green_btn">Login</button>
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
          <p className="mb-4 text-lg text-gray-600">
            Oops! Looks like you're lost. Try again!
          </p>
          <div className="animate-bounce">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
