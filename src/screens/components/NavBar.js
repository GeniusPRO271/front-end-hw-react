import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import CartContext from './cartNumContext';

function NavBar() {
  const token = localStorage.getItem('token');
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const { cartNumber, setCartNumber } = useContext(CartContext);

  useEffect(() => {
    getBasket();
    checkToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function checkToken() {
    if (token !== undefined) {
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
            if (error.response.status === 401) {
              localStorage.removeItem('token');
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
        });
    }
  }
  const getBasket = () => {
    axios
      .get('https://food-delivery.kreosoft.ru/api/basket', {
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setCartNumber(response.data.length);
        }
      })
      .catch((error) => {
        // Handle the error here
        if (error.response) {
          if (error.response.status === 401) {
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
  };

  const handleLogOut = (event) => {
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
              <a className="navbar-brand" href="/">
                Delivery.Eats
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/item">
                Menu
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/orders">
                Orders
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/cart">
                Cart <span className="badge text-bg-success">{cartNumber}</span>
              </a>
            </li>
          </ul>
        </div>
        {isLogin ? (
          <div>
            <a
              className="mx-2 text-decoration-none"
              id="user-email"
              href="/profile"
              style={{ color: 'black' }}
            >
              {email}
            </a>
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
