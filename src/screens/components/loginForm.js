import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

function LoginForm({ showModal, setShowModal }) {
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
        console.log(error);
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

  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="login-form">
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
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleLogin}>
          Log In
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginForm;
