import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../css/menu.css';
import LoginForm from './components/loginForm';
import CartContext from './components/cartNumContext';

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSort, setSelectedSort] = useState('None');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [dishes, setDishes] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageNumCount, setPageNumCount] = useState(null);
  const [basket, setBasket] = useState([]);
  const { setCartNumber } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);

  const handleCheckBoxesCategory = (event) => {
    if (event.target.checked) {
      setSelectedCategory([...selectedCategory, event.target.value]);
    } else {
      setSelectedCategory(
        selectedCategory.filter((value) => value !== event.target.value)
      );
    }
  };
  const handleSelectedSort = (event) => {
    if (event.target.checked) {
      setSelectedSort(event.target.value);
    }
  };
  const handleFilters = (event) => {
    event.preventDefault();
    let url = `${window.location.origin}${window.location.pathname}?`;
    // Check whether the URL already has query parameters

    // add categories to url
    if (selectedCategory.length > 0) {
      selectedCategory.forEach((category, index) => {
        if (category) {
          if (index === 0) {
            url += `categories=${category}`;
          } else {
            url += `&categories=${category}`;
          }
        }
      });
    }

    // add vegetarian to url
    if (isVegetarian !== undefined) {
      url += `&vegetarian=${isVegetarian}`;
    }

    // add sorting to url
    if (selectedSort !== 'None') {
      url += `&sorting=${selectedSort}`;
    }

    window.location.href = url;
  };
  const handlePagination = (event) => {
    event.preventDefault();
    let url = `${window.location.origin}${window.location.pathname}?`;
    const buttonValue = event.target.getAttribute('value');
    // add page to url
    if (selectedCategory.length > 0) {
      selectedCategory.forEach((category, index) => {
        if (category) {
          if (index === 0) {
            url += `categories=${category}`;
          } else {
            url += `&categories=${category}`;
          }
        }
      });
    }

    // add vegetarian to url
    if (isVegetarian !== undefined) {
      url += `&vegetarian=${isVegetarian}`;
    }

    // add sorting to url
    if (selectedSort !== 'None') {
      url += `&sorting=${selectedSort}`;
    }

    // add page to url
    if (buttonValue !== undefined && buttonValue !== 1) {
      url += `&page=${buttonValue}`;
    }

    window.location.href = url;
  };
  const getPagination = (pagination) => {
    let pag = [];
    for (let index = 0; index < pagination; index++) {
      pag.push(index + 1);
    }
    setPageNumCount(pag);
  };
  const handleRightArrow = (event) => {
    event.preventDefault();
    if (pageNum < pageNumCount.length) {
      let url = `${window.location.origin}${window.location.pathname}?`;
      const buttonValue = pageNum + 1;

      // add page to url
      if (selectedCategory.length > 0) {
        selectedCategory.forEach((category, index) => {
          if (category) {
            if (index === 0) {
              url += `categories=${category}`;
            } else {
              url += `&categories=${category}`;
            }
          }
        });
      }

      // add vegetarian to url
      if (isVegetarian !== undefined) {
        url += `&vegetarian=${isVegetarian}`;
      }

      // add sorting to url
      if (selectedSort !== 'None') {
        url += `&sorting=${selectedSort}`;
      }

      // add page to url
      if (buttonValue !== undefined && buttonValue !== 1) {
        url += `&page=${buttonValue}`;
      }

      window.location.href = url;
    }
  };
  const handleLeftArrow = (event) => {
    event.preventDefault();
    if (pageNum > 1) {
      let url = `${window.location.origin}${window.location.pathname}?`;
      const buttonValue = pageNum - 1;

      // add page to url
      if (selectedCategory.length > 0) {
        selectedCategory.forEach((category, index) => {
          if (category) {
            if (index === 0) {
              url += `categories=${category}`;
            } else {
              url += `&categories=${category}`;
            }
          }
        });
      }

      // add vegetarian to url
      if (isVegetarian !== undefined) {
        url += `&vegetarian=${isVegetarian}`;
      }

      // add sorting to url
      if (selectedSort !== 'None') {
        url += `&sorting=${selectedSort}`;
      }

      // add page to url
      if (buttonValue !== undefined && buttonValue !== 1) {
        url += `&page=${buttonValue}`;
      }

      window.location.href = url;
    }
  };
  const ParseURL = () => {
    let url = window.location.search;
    let api_url = 'https://food-delivery.kreosoft.ru/api/dish?';
    let params = url.substring(1);
    let call_api = api_url + params;
    if (params) {
      axios
        .get(call_api)
        .then((response) => {
          getPagination(response.data.pagination.count);
          setPageNum(response.data.pagination.current);
          setDishes(response.data.dishes);
        })
        .catch((error) => console.log(error));
    } else {
    }
  };

  function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const categories = urlParams.getAll('categories');
    const vegetarian = urlParams.get('vegetarian') === 'true';
    const sorting = urlParams.get('sorting');
    const page = urlParams.get('page');
    if (sorting == null) {
      setSelectedSort('None');
    } else {
      setSelectedSort(sorting);
    }

    setPageNum(page);
    setSelectedCategory(categories);
    setIsVegetarian(vegetarian);
  }
  const RatingStars = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="bi bi-star-fill" style={{ color: 'orange' }}></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i
          key={stars.length}
          className="bi bi-star-half"
          style={{ color: 'orange' }}
        ></i>
      );
    }

    const emptyStars = 10 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={stars.length} className="bi bi-star-fill"></i>);
    }

    return <div>{stars}</div>;
  };
  const handleAddToCard = (event, dishId) => {
    event.preventDefault();
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
        if (response.status === 200) {
          getBasket();
        } else {
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setShowModal(true);
        }
      });
  };
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
  const handleRemoveCard = (event, dishId) => {
    event.preventDefault();
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
        if (response.status) {
          getBasket();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    ParseURL();
    parseURLParams();
    getBasket();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div
        className="container"
        style={{
          maxWidth: '80%',
          padding: 10,
          boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        }}
      >
        <LoginForm showModal={showModal} setShowModal={setShowModal} />
        <form className="row border m-1 align-items-center" id="form_id">
          <div className="col dropdown col-md-3 m-3">
            <button
              className="btn border  w-100 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="name-tag-category"
            >
              Nothing selected
            </button>
            <div className="row dropdown-menu w-75 " id="dropdown_category">
              <div className="form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  name="Wok"
                  id="Wok_id"
                  value="Wok"
                  onChange={handleCheckBoxesCategory}
                  checked={selectedCategory.includes('Wok')}
                />
                <label className="form-check-label ml-2" htmlFor="Wok_id">
                  Wok
                </label>
              </div>
              <div className="form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  name="Pizza"
                  id="Pizza_id"
                  value="Pizza"
                  onChange={handleCheckBoxesCategory}
                  checked={selectedCategory.includes('Pizza')}
                />
                <label className="form-check-label ml-2" htmlFor="Pizza_id">
                  Pizza
                </label>
              </div>
              <div className="form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  name="Soup"
                  id="Soup_id"
                  value="Soup"
                  onChange={handleCheckBoxesCategory}
                  checked={selectedCategory.includes('Soup')}
                />
                <label className="form-check-label ml-2" htmlFor="Soup_id">
                  Soup
                </label>
              </div>
              <div className="form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  name="Dessert"
                  id="Dessert_id"
                  value="Dessert"
                  onChange={handleCheckBoxesCategory}
                  checked={selectedCategory.includes('Dessert')}
                />
                <label className="form-check-label ml-2" htmlFor="Dessert_id">
                  Dessert
                </label>
              </div>
              <div className="form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="checkbox"
                  name="Drink"
                  id="Drink_id"
                  value="Drink"
                  onChange={handleCheckBoxesCategory}
                  checked={selectedCategory.includes('Drink')}
                />
                <label className="form-check-label ml-2" htmlFor="Drink_id">
                  Drink
                </label>
              </div>
            </div>
          </div>
          <div className="col dropdown col-md-3 m-3" id="sort_button">
            <button
              className="btn border  w-100 dropdown-toggle"
              type="click"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="sortBtn"
            >
              {selectedSort !== null ? selectedSort : 'Sorting options'}
            </button>
            <div className="row dropdown-menu w-75" id="sort_options">
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="None_id"
                  value="None"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'None'}
                />
                <label className="form-check-label ml-2" htmlFor="None_id">
                  None
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="NameAsc_id"
                  value="NameAsc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'NameAsc'}
                />
                <label className="form-check-label ml-2" htmlFor="NameAsc_id">
                  NameAsc
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="NameDesc_id"
                  value="NameDesc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'NameDesc'}
                />
                <label className="form-check-label ml-2" htmlFor="NameDesc_id">
                  NameDesc
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="PriceAsc_id"
                  value="PriceAsc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'PriceAsc'}
                />
                <label className="form-check-label ml-2" htmlFor="PriceAsc_id">
                  PriceAsc
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="PriceDesc_id"
                  value="PriceDesc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'PriceDesc'}
                />
                <label className="form-check-label ml-2" htmlFor="PriceDesc_id">
                  PriceDesc
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="RatingAsc_id"
                  value="RatingAsc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'RatingAsc'}
                />
                <label className="form-check-label ml-2" htmlFor="RatingAsc_id">
                  RatingAsc
                </label>
              </div>
              <div className="col form-check form-check-inline m-1">
                <input
                  className="form-check-input ml-2"
                  type="radio"
                  name="sort_opt"
                  id="RatingDesc_id"
                  value="RatingDesc"
                  onChange={handleSelectedSort}
                  checked={selectedSort === 'RatingDesc'}
                />
                <label
                  className="form-check-label ml-2"
                  htmlFor="RatingDesc_id"
                >
                  RatingDesc
                </label>
              </div>
            </div>
          </div>
          <div
            className="form-check form-switch col-md m-3"
            id="isVegetarian_id"
          >
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="toggle_switch"
              onChange={(e) => setIsVegetarian(e.target.checked)}
              checked={isVegetarian}
            />
            <label className="form-check-label" htmlFor="toggle_switch">
              Show only vegetarian dishes
            </label>
          </div>
          <div className="col-md-auto m-3" id="apply_changes">
            <button
              type="click"
              className="btn btn-primary float-md-right"
              onClick={handleFilters}
            >
              Apply Changes
            </button>
          </div>
        </form>
        <div id="menu-container">
          <div className="row row-cols-lg-4 row-cols-sm-1 row-cols-md-2 flex-column flex-md-row">
            {dishes &&
              dishes.map((d, index) => {
                return (
                  <div className="col p-3" key={index}>
                    <a href={'/item/' + d.id}>
                      <img
                        src={d.image}
                        alt="Logo"
                        className="border img-fluid"
                      />
                    </a>
                    <div className="border p-3" style={{ height: 350 }}>
                      <h4>{d.name}</h4>
                      <h6 style={{ color: 'grey' }}>
                        Dish category - {d.category}
                      </h6>

                      <div
                        className="border p-1 "
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <RatingStars key={index} rating={d.rating} />
                      </div>
                      <h6 style={{ color: 'black', fontWeight: 'normal' }}>
                        {d.description}
                      </h6>
                    </div>
                    <div className="row border p-3 mx-0">
                      <h6 className="col mt-2" style={{ fontSize: 16 }}>
                        Price - {d.price} ₽
                      </h6>
                      {basket && basket.some((item) => item.id === d.id) ? (
                        <div className="col pagination">
                          <span
                            className=" col page-link"
                            style={{ fontSize: 14, textAlign: 'center' }}
                            onClick={(e) => {
                              handleRemoveCard(e, d.id);
                            }}
                          >
                            -
                          </span>
                          <span
                            className=" col page-link"
                            style={{ fontSize: 14, textAlign: 'center' }}
                          >
                            {basket.find((item) => item.id === d.id).amount}
                          </span>
                          <span
                            className=" col page-link"
                            style={{ fontSize: 14, textAlign: 'center' }}
                            onClick={(e) => {
                              handleAddToCard(e, d.id);
                            }}
                          >
                            +
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="col btn btn-primary"
                          style={{ fontSize: 14 }}
                          onClick={(e) => {
                            handleAddToCard(e, d.id);
                          }}
                        >
                          Add To Card
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {dishes && (
          <nav aria-label="Page navigation example">
            <ul className=" col pagination">
              <li className="page-item">
                <span className="page-link" onClick={handleLeftArrow}>
                  <i className="bi bi-arrow-left"></i>
                </span>
              </li>
              {pageNumCount &&
                pageNumCount.map((d, index) => {
                  return (
                    <li
                      key={index}
                      className={`page-item ${d === pageNum ? 'active' : ''}`}
                    >
                      <span
                        className="page-link"
                        value={d}
                        onClick={handlePagination}
                      >
                        {d}
                      </span>
                    </li>
                  );
                })}

              <li className="page-item">
                <span className="page-link" onClick={handleRightArrow}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Menu;
