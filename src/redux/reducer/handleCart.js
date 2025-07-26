import productStockCategory from "../../data/productStockCategory";

// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if product already in cart
      const exist = state.find((x) => x.id === product.id);
      const stockLimit = productStockCategory[product.id]?.stock || Infinity;

      if (exist) {
        if (exist.qty >= stockLimit) {
          // Do not increase quantity beyond stock limit
          return state;
        }
        // Increase the quantity
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        if (stockLimit < 1) {
          // Stock limit zero, do not add
          return state;
        }
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find((x) => x.id === product.id);
      if (exist2.qty === 1) {
        updatedCart = state.filter((x) => x.id !== exist2.id);
      } else {
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
