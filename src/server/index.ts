const express = require('express');
const path = require('path');
const app = express();

const {
  PORT,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
  FACEBOOK_APP_ID,
  HTTP_URL,
} = process.env;

const PUBLIC_PATH = path.join(__dirname, '../src/client/public');

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

// The use of templates is very minimal. We use it to centralize
// environment variables so that it's easy for non-technical people
// to update the code & deploy the server on their own.
app.set('views', path.join(__dirname, '../src/client/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  return res.render('index',
    {
      STRIPE_PUBLIC_KEY,
      FACEBOOK_APP_ID,
    }
  );
});

app.use(express.static(PUBLIC_PATH));

app.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}`);
});
