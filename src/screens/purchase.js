import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Purchase() {
  const [basket, SetBasket] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [addressErr, setAddressErr] = useState(null);
  const [dateErr, setDateErr] = useState(null);
  const token = localStorage.getItem('token');

  function formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
          let sum = 0;
          response.data.map((d) => {
            return (sum += d.totalPrice);
          });
          SetBasket(response.data);
          setTotalPrice(sum);
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
  function getUserData() {
    if (token !== undefined) {
      axios
        .get('https://food-delivery.kreosoft.ru/api/account/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setPhone(response.data.phoneNumber);
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
          window.location.href = window.location.origin + '/login';
        });
    } else {
      window.location.href = window.location.origin + '/login';
    }
  }
  const handleDate = (event) => {
    const now = new Date();
    const selectedTime = new Date(event.target.value);
    const minTime = new Date(now.getTime() + 60 * 60 * 1000);

    if (selectedTime < minTime) {
      setDate(formatDate(minTime));
    } else {
      setDate(event.target.value);
    }
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const CreateOrder = (event) => {
    event.preventDefault();
    if (address && date) {
      axios
        .post(
          'https://food-delivery.kreosoft.ru/api/order',
          {
            deliveryTime: date,
            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // handle success
          window.location.href = window.location.origin + '/orders';
        })
        .catch((error) => {
          // handle error
          console.error(error.response.data);
        });
    } else {
      if (address === null || address === '') {
        setAddressErr('Address cant be empty');
      }
      if (
        date === null ||
        date < new Date(new Date().getTime() + 60 * 60 * 1000)
      ) {
        setDateErr('Invalid date');
      }
    }
  };
  useEffect(() => {
    getUserData();
    getBasket();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
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
      <div className="row justify-content-center p-3">
        <div className="col">
          <div id="purchase-form">
            <div className="mb-3">
              <h1>Create Order</h1>
            </div>
            <div className="mb-3">
              <h3>User Data</h3>
            </div>
            <div className=" row mb-3">
              <fieldset className=" col form-floating" disabled>
                <input
                  type="phone"
                  className="form-control"
                  id="phoneNumeber"
                  placeholder=""
                  value={phone}
                  readOnly
                />
                <label htmlFor="phoneNumeber" className="mx-2">
                  Phone number
                </label>
              </fieldset>
              <fieldset className=" col form-floating " disabled>
                <input
                  type="email"
                  className="form-control"
                  id="emailField"
                  placeholder=""
                  value={email}
                  readOnly
                />
                <label htmlFor="emailField" className="mx-2">
                  Email
                </label>
              </fieldset>
            </div>
            <div className="mb-3">
              <h3>Delivery data</h3>
            </div>
            <div className=" row mb-3">
              <form className=" col form">
                <label htmlFor="timeField" className="mb-1">
                  Delivery address
                </label>
                <input
                  type="phone"
                  className="form-control"
                  id="phoneNumeber"
                  placeholder={address}
                  value={address}
                  onChange={handleAddress}
                  required={true}
                />
                {addressErr && (
                  <div
                    className="alert alert-danger mt-2"
                    role="alert"
                    id="error_alert"
                  >
                    {addressErr}
                  </div>
                )}
              </form>
              <form className=" col form">
                <label htmlFor="timeField" className="mb-1">
                  Delivery Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="timeField"
                  placeholder={date}
                  value={date}
                  onChange={handleDate}
                  required={true}
                  min={formatDate(
                    new Date(new Date().getTime() + 60 * 60 * 1000)
                  )}
                />
                {dateErr && (
                  <div
                    className="alert alert-danger mt-2"
                    role="alert"
                    id="error_alert"
                  >
                    {dateErr}
                  </div>
                )}
              </form>
            </div>
            <form className="m-2">
              <span>Item list:</span>
              {basket &&
                basket.map((d, index) => {
                  return (
                    <div
                      key={index}
                      className="row border"
                      style={{ padding: 5 }}
                    >
                      <div
                        className=" col-lg-2 "
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={d.image}
                          alt="Logo"
                          className="w-75 h-90 rounded-pill"
                        />
                      </div>
                      <div className="col-sm-auto mt-2 ">
                        <h4
                          className="text-nowrap"
                          style={{
                            fontSize: 15,
                            lineHeight: '1.5',
                            fontWeight: 'bold',
                          }}
                        >
                          {d.name}
                        </h4>
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: '1',
                            wordSpacing: 0.5,
                          }}
                        >
                          Price: {d.price} ₽/dish <br />
                          <br />
                          Quantity - {d.amount}
                        </p>
                      </div>
                      <div
                        className="col"
                        style={{
                          position: 'relative',
                          textAlign: 'end',
                        }}
                      >
                        <p
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 10,
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>Price: </span>
                          {d.totalPrice} ₽
                        </p>
                      </div>
                    </div>
                  );
                })}
              <div className="col mt-3">
                <span className="row" style={{ fontSize: 16, padding: 5 }}>
                  {' '}
                  Total: {totalPrice} ₽
                </span>
                <button className=" row btn btn-success" onClick={CreateOrder}>
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchase;
