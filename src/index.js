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
import App from './screens/App';
import Cart from './screens/cart';
import CartContext from './screens/components/cartNumContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
    path: '/menu',
    element: <Menu />,
  },
  {
    path: '/cart',
    element: <Cart />,
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
