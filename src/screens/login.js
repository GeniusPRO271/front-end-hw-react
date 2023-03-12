import React, { useState } from 'react';
import axios from 'axios';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .post(
        'https://food-delivery.kreosoft.ru/api/account/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          setSuccess('Loged In');
          setErr(null);
          window.location.reload();
        } else {
          setErr('Connection Error');
          setSuccess(null);
        }
        // Handle successful response here
      })
      .catch((error) => {
        setSuccess(null);
        // Handle any errors that occur during the API call here
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setErr(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  return (
    <div>
      <div
        className="container w-100"
        style={{
          maxWidth: '80%',
          padding: 10,
          boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        }}
      >
        <div className="row justify-content-center">
          <div className="col">
            <form id="login-form">
              <div className="mb-3">
                <h1>Authorization</h1>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
              {err && (
                <div
                  className="alert alert-danger mt-2"
                  role="alert"
                  id="error_alert"
                >
                  {err}
                </div>
              )}
              {success && (
                <div
                  className="alert alert-success mt-2"
                  role="alert"
                  id="success_box"
                >
                  {success}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
