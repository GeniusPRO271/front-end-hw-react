import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NavBar() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    console.log('first load(if two times is probably on stric mode)');
    checkToken();
  }, []);

  function checkToken() {
    const token = localStorage.getItem('token');
    if (token != undefined) {
      console.log('user is logged in');
      axios
        .get('https://food-delivery.kreosoft.ru/api/account/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setIsLogin(true);
            setEmail(response.data.email);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // Handle the error here
          if (error.response) {
            if (error.response.status == 401) {
              localStorage.removeItem('token');
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
        });
    } else {
      console.log('user is not logged in');
    }
  }

  const handleLogOut = (event) => {
    console.log('loged out');
    setIsLogin(false);
    setEmail('');
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <nav
      className="border-bottom navbar navbar-expand-lg bg-body-tertiary"
      style={{ padding: 10, paddingBottom: 10 }}
    >
      <div className="container-fluid">
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="navbar-brand" href="/screens/home.html">
                Delivery.Eats
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/menu">
                Menu
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/screens/orders.html">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/screens/card.html">
                Cart
              </a>
            </li>
          </ul>
        </div>
        {isLogin ? (
          <div>
            <span className="mx-2" id="user-email">
              {email}
            </span>
            <button
              id="logout-btn"
              className="btn btn-primary"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <a href="/login" className="btn btn-primary mx-2" id="login-btn">
              Login
            </a>
            <a href="/register" className="btn btn-primary" id="register-btn">
              Register
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
