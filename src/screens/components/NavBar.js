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
        <a className="navbar-brand" href="/">
          Delivery.Eats
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className=" row collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav p-2">
            <li className="col-0 nav-item">
              <a className="nav-link" href="/item">
                Menu
              </a>
            </li>
            <li className="col-0 nav-item">
              <a className="nav-link" href="/orders">
                Orders
              </a>
            </li>
            <li className=" col-0 nav-item">
              <a className="nav-link" href="/cart">
                Cart <span className="badge text-bg-success">{cartNumber}</span>
              </a>
            </li>
            {isLogin ? (
              <>
                <li className="col nav-item text-lg-end">
                  <a
                    className="nav-link"
                    href="/profile"
                    style={{ color: 'black' }}
                  >
                    {email}
                  </a>
                </li>
                <li>
                  <button
                    className=" col btn btn-primary"
                    onClick={handleLogOut}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className=" col nav-item text-lg-end m-lg-0 m-1">
                  <a
                    href="/login"
                    className="btn btn-primary mx-2"
                    id="login-btn"
                  >
                    Login
                  </a>
                </li>
                <li className=" col-0 nav-item">
                  <a
                    href="/register"
                    className="btn btn-primary"
                    id="register-btn"
                  >
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
