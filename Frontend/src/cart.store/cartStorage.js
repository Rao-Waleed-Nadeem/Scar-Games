const KEY = "cart_items";

export const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // fallback on JSON parse error
  }
};

export const saveCartToStorage = (carts) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(carts));
  } catch {
    /* ignore quota errors */
  }
};
