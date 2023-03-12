import React, { useEffect, useState } from 'react';
import axios from 'axios';
function Orders() {
  const [orders, setOrders] = useState(null);
  const [basket, setBasket] = useState(null);
  const token = localStorage.getItem('token');

  function FromatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate; // Output: 12-03-2023
  }
  function FormateDataHrs(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDate;
  }
  function getOrders() {
    axios
      .get('https://food-delivery.kreosoft.ru/api/order', {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setOrders(response.data);
        }
      })
      .catch((error) => {
        // Handle the error here
        if (error.response) {
          if (error.response.status === 401) {
            console.log('user is not loged in');
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
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
          setBasket(response.data);
        }
      })
      .catch((error) => {
        // Handle the error here
        if (error.response) {
          if (error.response.status === 401) {
            console.log('user is not loged in');
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
  };
  const handleConfirmOrder = (event, id) => {
    event.preventDefault();
    axios
      .post(
        `https://food-delivery.kreosoft.ru/api/order/${id}/status`,
        {},
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // handle success
        if (response.status === 200) {
          getOrders();
        }
      })
      .catch((error) => {
        // handle error
        console.error(error.response.data);
      });
  };
  useEffect(() => {
    getBasket();
    getOrders();
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
          <div id="order-form">
            {basket && basket.length > 0 && (
              <div className="row mb-3 border p-3 mx-0 align-items-center">
                <div className="col" style={{ fontSize: 14 }}>
                  An order can be created with the items in the cart
                </div>
                <div className="col-auto">
                  <a className="btn btn-success" href="/purchase">
                    Create order
                  </a>
                </div>
              </div>
            )}
            <div className="mb-3">
              <h1>Previus orders</h1>
            </div>
            <form className="m-2">
              {orders &&
                orders.map((d, index) => {
                  return (
                    <div
                      key={index}
                      className="row border"
                      style={{ padding: 5 }}
                    >
                      <div className="col-sm-auto mt-2 ">
                        <a
                          className="text-nowrap"
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'black',
                            lineHeight: '3',
                          }}
                          href={'/orders/' + d.id}
                        >
                          Order from {FromatDate(d.orderTime)}
                        </a>
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: '1',
                            wordSpacing: 0.5,
                          }}
                        >
                          Order Status -{' '}
                          {d.status === 'InProcess' ? 'In Process' : d.status}
                          <br />
                          <br />
                          Delivery Time: {FormateDataHrs(d.deliveryTime)}
                        </p>
                      </div>

                      <div
                        className="col"
                        style={{
                          position: 'relative',
                          textAlign: 'end',
                        }}
                      >
                        {d.status === 'InProcess' && (
                          <button
                            className="btn btn btn-outline-success mt-1 "
                            style={{
                              textAlign: 'center',
                              fontSize: 13,
                            }}
                            onClick={(e) => handleConfirmOrder(e, d.id)}
                          >
                            Confirm Order
                          </button>
                        )}
                        <p
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 10,
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            Total order cost:{' '}
                          </span>
                          {d.price} ₽
                        </p>
                      </div>
                    </div>
                  );
                })}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
