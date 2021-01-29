#!/usr/bin/env perl
use Mojolicious::Lite -signatures;
use Net::Stripe;

app->secrets(['3ffb512774f4016864e20db1d567d36b']);

get '/' => sub ($c) {
  $c->reply->static('index.html');
};

post '/create-payment-intent' => sub ($c) {
  my $stripe = Net::Stripe->new(api_key => '<your api key>');
  my $payment_intent = $stripe->create_payment_intent(  # Net::Stripe::PaymentIntent
      amount      => 1999,
      currency    => 'usd',
  );

  $c->render(json => {clientSecret => $payment_intent->client_secret});
};

app->start;
