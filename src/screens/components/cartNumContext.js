import React from 'react';

const CartContext = React.createContext({
  cartNumber: 0,
  setCartNumber: () => {},
});

export default CartContext;
