import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import success from './../../../assets/images/success.png';
import './EmailVerify.css';

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const params = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:4000/api/user/${params.id}/verify/${params.token}`;
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [params]);

  return (
    <div className="container">
      {validUrl ? (
        <>
          <img src={success} alt="success_img" className="success_img" />
          <h1 className="succ-msg">Email verified successfully</h1>
          <Link to="/login">
            <button className="green_btn">Login</button>
          </Link>
        </>
      ) : (
        <h1 className="not-found">404 Not Found</h1>
      )}
    </div>
  );
};

export default EmailVerify;
