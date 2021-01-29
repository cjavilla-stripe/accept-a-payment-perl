document.addEventListener('DOMContentLoaded', async () => {
  const stripe = Stripe('pk_test_vAZ3gh1LcuM7fW4rKNvqafgB00DR9RKOjN');
  const elements = stripe.elements();
  const card = elements.create('card');
  card.mount('#card-element');

  // When the form is submitted...
  var form = document.getElementById('payment-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Make a call to the server to create a new
    // payment intent and store its client_secret.
    const resp = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
        paymentMethodType: 'card',
      }),
    }).then(r => r.json());

    if(resp.error) {
      console.log(resp.error.message);
      return;
    }

    console.log(`Client secret returned.`);

    const nameInput = document.querySelector('#name');

    // Confirm the card payment given the clientSecret
    // from the payment intent that was just created on
    // the server.
    let {error, paymentIntent} = await stripe.confirmCardPayment(resp.clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: nameInput.value,
        }
      }
    });

    if(error) {
      console.log(error.message);
      return;
    }

    console.log(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
  });
});
