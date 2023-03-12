import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function OrderId() {
  const id = useParams().id;
  const [data, setData] = useState(null);
  const [dishes, setDishes] = useState(null);
  const token = localStorage.getItem('token');
  function FormateDataHrs(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDate; // Output: 12-03-2023 20:38
  }
  const getData = () => {
    let url = `https://food-delivery.kreosoft.ru/api/order/${id}`;
    axios
      .get(url, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDishes(response.data.dishes);
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
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
  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    data && (
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
        <div className="row justify-content-center m-2 card">
          <div className="card-header">
            <h3>Order {data.id}</h3>
          </div>
          <div className="card-body">
            <p>
              Created at : {FormateDataHrs(data.orderTime)}
              <br></br>
              Delivery Time : {FormateDataHrs(data.deliveryTime)}
              <br></br>
              Delivery address: {data.address}
              <br></br>
              Order Status - {data.status} <br></br>
            </p>
            <form className="mx-2">
              <span>Item List</span>
              {dishes &&
                dishes.map((d, index) => {
                  return (
                    <div key={index} className="row border">
                      <div
                        className=" col-1 "
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={d.image}
                          alt="Logo"
                          className="w-100 h-90 rounded-pill"
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
              <div className="block mt-3" style={{ fontWeight: 'bold' }}>
                Total: {data.price} ₽
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default OrderId;
