import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './screens/components/NavBar';
import LoginScreen from './screens/login';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Register from './screens/register';
import Profile from './screens/profile';
import Menu from './screens/menu';
import Cart from './screens/cart';
import CartContext from './screens/components/cartNumContext';
import Orders from './screens/order';
import Purchase from './screens/purchase';
import OrderId from './screens/orderId';
import MenuId from './screens/menuId';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/item',
    element: <Menu />,
  },
  {
    path: '/item/:id',
    element: <MenuId />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/orders/:id',
    element: <OrderId />,
  },
  {
    path: '/purchase',
    element: <Purchase />,
  },
]);

function Root() {
  const [cartNumber, setCartNumber] = useState(0);

  return (
    <CartContext.Provider value={{ cartNumber, setCartNumber }}>
      <React.StrictMode>
        <NavBar />
        <RouterProvider router={router} />
      </React.StrictMode>
    </CartContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
