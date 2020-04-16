// Replace this with your public key
const stripe = Stripe(AppConfig.STRIPE_PUBLIC_KEY);

const checkout = async () => {
  try {
    const response = await fetch('/session', {
      method: 'POST'
    }).then(resp => resp.json());

    if (response.error) {
      throw new Error(response.error);
    }

    const result = await stripe.redirectToCheckout({
      sessionId: response.id,
    });

    if (result.error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

const select = (selector) => document.querySelector(selector);
const setText = (selector, text) => select(selector).textContent = text;

document.addEventListener('click', async ({ target }) => {
  if (target.matches('.buy-music-credits')) {
    const checkoutOK = await checkout();
    if (!checkoutOK) {
      setText('purchase-status', 'Sorry, there was a problem purchasing music.');
    }
  }
});
