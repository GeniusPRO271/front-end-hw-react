import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function MenuId() {
  const id = useParams().id;
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(0);
  const [canRate, setCanRate] = useState(false);

  const handleRatingClick = (newRating) => {
    setRating(newRating);
    ApplyRate(newRating);
  };
  const getData = () => {
    axios
      .get('https://food-delivery.kreosoft.ru/api/dish/' + id, {
        headers: {
          accept: 'application/json',
        },
      })
      .then((response) => {
        if (response.data) {
          setData(response.data);
          setRating(Math.floor(response.data.rating));
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
  const getCanRate = () => {
    axios
      .get(
        'https://food-delivery.kreosoft.ru/api/dish/' + id + '/rating/check',
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          setCanRate(response.data);
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
  const ApplyRate = (newRating) => {
    axios
      .post(
        'https://food-delivery.kreosoft.ru/api/dish/' +
          id +
          '/rating?ratingScore=' +
          newRating,
        {},
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {})
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
  useEffect(() => {
    getData();
    getCanRate();
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
        <div className="row justify-content-center">
          <div className="col">
            <form id="login-form">
              <div className="mb-3">
                <h1>{data.name}</h1>
              </div>
              <div className="border p-2" style={{ textAlign: 'center' }}>
                <img src={data.image} alt="Logo" className="w-25 h-100" />
                <p>
                  Dish category - {data.category} <br></br>
                  {data.vegetarian ? 'Is vegetarian ' : 'Not vegetarian'}
                </p>
                <p>{data.description}</p>
                <div
                  className="border"
                  style={{ margin: '0 auto', width: '15%' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star, index) => {
                    return star <= rating ? (
                      <i
                        key={index}
                        className="bi bi-star-fill"
                        style={{ color: 'orange' }}
                        onClick={() => (canRate ? handleRatingClick(star) : '')}
                      ></i>
                    ) : (
                      <i
                        key={index}
                        onClick={() => (canRate ? handleRatingClick(star) : '')}
                        className="bi bi-star-fill"
                      ></i>
                    );
                  })}
                </div>
                <p className="pt-3">Price: {data.price} ₽ / dish</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default MenuId;
