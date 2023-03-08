import React, { useState } from 'react';
import NavBar from './components/NavBar';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInput = (event) => {
    event.preventDefault();
    console.log(name, gender, phone, birth, address, email, pass);
    axios
      .post(
        'https://food-delivery.kreosoft.ru/api/account/register',
        {
          fullName: name,
          password: pass,
          email: email,
          address: address,
          birthDate: birth,
          gender: gender,
          phoneNumber: phone,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setSuccess('Registered');
          setErr(null);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle the error here
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response.headers);
          setErr('Empty Fields');
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const phoneMask = (event) => {
    let phone = event.target.value;
    const formattedPhone = phone
      .replace(/\D/g, '')
      .replace(/^7/, '')
      .replace(
        /(\d{3})(\d{1,3})?(\d{1,2})?(\d{1,2})?/,
        function (match, p1, p2, p3, p4) {
          if (p2 === undefined) {
            return '+7(' + p1 + ')';
          } else {
            return (
              '+7(' +
              p1 +
              ')' +
              ' ' +
              p2 +
              (p3 ? '-' + p3 : '') +
              (p4 ? '-' + p4 : '')
            );
          }
        }
      );
    let value = formattedPhone;
    if (value.length > 17) {
      value = value.substring(0, 17);
    }
    setPhone(value);
  };
  return (
    <div>
      <NavBar />
      <div
        className="container w-100"
        style={{
          padding: 10,
          boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        }}
      >
        <div className="row justify-content-center">
          <div className="col">
            <form id="register-form">
              <div className="mb-3">
                <h1>Register new account</h1>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-select w-100 p-2"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => phoneMask(e)}
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  data-js="input"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="date_of_birth" className="form-label">
                  Date of Birth
                </label>
                <input
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  required
                />
              </div>
              <button
                type="click"
                className="btn btn-primary"
                onClick={handleInput}
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
                  <a href="/login"> Login </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
