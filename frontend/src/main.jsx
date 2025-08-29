
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
const stripePromise = loadStripe("pk_test_51S00iXA8oYcy4eLJTeLFoRWvJQUqpU7wvrAbIi8rSOQsifs1Yf1JfyOM5knuYDpqNi7uHSLxqL6tGMSnJzUti8NX00ypqEW7T7");

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
  <BrowserRouter>
    < App />
  </BrowserRouter>
  </Elements>
)
