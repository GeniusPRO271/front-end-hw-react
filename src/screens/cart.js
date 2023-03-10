import React, { useContext, useEffect, useState } from 'react';
import CartContext from './components/cartNumContext';
import axios from 'axios';

function Cart() {
  const token = localStorage.getItem('token');
  const [basket, setBasket] = useState(null);
  const { setCartNumber } = useContext(CartContext);

  const handleAddToCard = (event, dishId) => {
    event.preventDefault();
    console.log(token);
    axios
      .post(
        `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log('added');
          getBasket();
        } else {
          console.log('error');
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log('not loged in');
        }
      });
  };

  const handleRemoveCard = (event, dishId) => {
    event.preventDefault();
    console.log(token);
    axios
      .delete(
        `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}?increase=true`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status) {
          getBasket();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDelete = (event, dishId) => {
    event.preventDefault();
    console.log(token);
    axios
      .delete(
        `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}?increase=false`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status) {
          getBasket();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getBasket();
  }, []);
  const getBasket = () => {
    console.log('getting basket');
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
  return (
    <div
      className="container w-100"
      style={{
        padding: 20,
        boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
      }}
    >
      <div>
        <h1>Your Cart</h1>
      </div>
      {basket &&
        basket.map((d, index) => {
          return (
            <div
              key={index}
              className="row border flex-sm-row flex-column h-100 "
              style={{ padding: 5 }}
            >
              <div className="col-sm-auto d-none d-sm-block">{index + 1}.</div>
              <div
                className="col-sm-2"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={d.image}
                  alt="Logo"
                  className="h-100 w-100"
                  style={{ border: 1, borderRadius: 20 }}
                />
              </div>
              <div className="col-sm-auto mt-2 " style={{ paddingLeft: 30 }}>
                <h4 className="text-nowrap" style={{ fontSize: 25 }}>
                  {d.name}
                </h4>
                <p style={{ fontSize: 20 }}>Price/dish - {d.price} ₽</p>
              </div>
              <div className="col mt-2  pagination " style={{ height: 30 }}>
                <span
                  className="page-link"
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                  onClick={(e) => {
                    handleRemoveCard(e, d.id);
                  }}
                >
                  -
                </span>
                <span
                  className="page-link"
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                >
                  {basket.find((item) => item.id === d.id).amount}
                </span>
                <span
                  className="page-link"
                  style={{
                    fontSize: 15,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}
                  onClick={(e) => {
                    handleAddToCard(e, d.id);
                  }}
                >
                  +
                </span>
              </div>

              <div
                className="col d-none d-sm-block"
                style={{ textAlign: 'right' }}
              >
                <button
                  className="btn btn-danger "
                  style={{ fontSize: 15, textAlign: 'center' }}
                  onClick={(e) => handleDelete(e, d.id)}
                >
                  Remove
                </button>
              </div>
              <div
                className="col d-block d-sm-none"
                style={{ textAlign: 'center' }}
              >
                <button
                  className=" row btn btn-danger w-100"
                  style={{ fontSize: 15, textAlign: 'center' }}
                  onClick={(e) => handleDelete(e, d.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Cart;
