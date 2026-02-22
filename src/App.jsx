import { useState, useEffect } from 'react';
import data from './data.json';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('desserts');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('desserts', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(i => i.name === p.name);
      if (exists) return prev.map(i => i.name === p.name ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, {...p, quantity: 1}];
    });
  };

  const decreaseQty = (name) => {
    setCart(prev => prev.map(i => i.name === name ? {...i, quantity: i.quantity - 1} : i).filter(i => i.quantity > 0));
  };

  const removeItem = (name) => setCart(prev => prev.filter(i => i.name !== name));

  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="container">
      <main>
        <h1 className="title">Desserts</h1>
        <div className="product-grid">
          {data.map((item, idx) => {
            const inCart = cart.find(i => i.name === item.name);
            return (
              <div key={idx} className="card">
                <div className={`img-box ${inCart ? 'active' : ''}`}>
                  <img src={item.image.desktop} alt="" className="prod-img" />
                  {!inCart ? (
                    <button className="add-btn" onClick={() => addToCart(item)}>
                      <img src="/assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
                    </button>
                  ) : (
                    <div className="qty-btn">
                      <button onClick={() => decreaseQty(item.name)} className="circle"><img src="/assets/images/icon-decrement-quantity.svg" alt="" /></button>
                      <span>{inCart.quantity}</span>
                      <button onClick={() => addToCart(item)} className="circle"><img src="/assets/images/icon-increment-quantity.svg" alt="" /></button>
                    </div>
                  )}
                </div>
                <div className="details">
                  <p className="cat">{item.category}</p>
                  <h2 className="name">{item.name}</h2>
                  <p className="price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <aside className="cart">
        <h2>Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
        {cart.length === 0 ? (
          <div className="empty">
            <img src="/assets/images/illustration-empty-cart.svg" alt="" />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          <>
            {cart.map(i => (
              <div key={i.name} className="cart-item">
                <div className="item-txt">
                  <p className="item-name">{i.name}</p>
                  <p><span className="qty-val">{i.quantity}x</span> <span className="u-price">@ ${i.price.toFixed(2)}</span> <span className="s-total">${(i.price * i.quantity).toFixed(2)}</span></p>
                </div>
                <button onClick={() => removeItem(i.name)} className="rm-btn">
                   <img src="/assets/images/icon-remove-item.svg" alt="" />
                </button>
              </div>
            ))}
            <div className="total-row"><span>Order Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <div className="carbon">
              <img src="/assets/images/icon-carbon-neutral.svg" alt="" />
              <p>This is a <span>carbon-neutral</span> delivery</p>
            </div>
            <button className="confirm" onClick={() => setIsModalOpen(true)}>Confirm Order</button>
          </>
        )}
      </aside>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-inner">
            <img src="/assets/images/icon-order-confirmed.svg" alt="" />
            <h1>Order Confirmed</h1>
            <p>We hope you enjoy your food!</p>
            <div className="summary">
              {cart.map(i => (
                <div key={i.name} className="sum-row">
                  <img src={i.image.thumbnail} alt="" />
                  <div className="sum-details">
                    <p className="sum-name">{i.name}</p>
                    <p><span className="qty-val">{i.quantity}x</span> @ ${i.price.toFixed(2)}</p>
                  </div>
                  <p className="sum-price">${(i.price * i.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="sum-total"><span>Order Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
            </div>
            <button className="new-btn" onClick={() => {setCart([]); setIsModalOpen(false)}}>Start New Order</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;