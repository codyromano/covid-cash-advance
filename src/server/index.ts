const express = require('express');
const path = require('path');
const app = express();

const {
  PORT,
  STRIPE_SECRET_KEY,
  HTTP_URL,
} = process.env;

const PUBLIC_PATH = path.join(__dirname, '../src/public');

const stripe = require('stripe')(STRIPE_SECRET_KEY);

app.post('/session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        name: 'Music credit',
        description: 'Allows you to purchase songs',
        images: ['https://example.com/t-shirt.png'],
        amount: 500,
        currency: 'usd',
        quantity: 1,
      }],
      success_url: `${HTTP_URL}?checkout_complete&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${HTTP_URL}?checkout_cancelled`,
    });

    return res.json({
      id: session.id,
      error: null,
    });
  } catch (error) {
    console.error(error);

    return res.json({
      error: 'There was problem starting your checkout session. Please try again.',
      id: null,
    });
  }
});

app.use(express.static(PUBLIC_PATH));

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
