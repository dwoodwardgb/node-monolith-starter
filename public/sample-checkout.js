window.onload = async function onLoad() {
  // dom elements
  const stripe = Stripe("pk_test_c8PdMeL1f8Fl7kUiO2lExwdx00KxDveyeI", {
    apiVersion: "2020-08-27",
  });
  const card = stripe.elements().create("card");
  card.mount("#payment-card-element");
  const form = document.getElementById("checkout-form");
  const submitButton = document.querySelector(
    '#checkout-form button[type="submit"]'
  );
  const errorsContainer = document.getElementById("card-errors");

  // state
  let paymentIsDone = false;
  let isLoading = false;

  form.addEventListener("submit", function (event) {
    if (isLoading) {
      event.preventDefault();
      return;
    }

    if (!paymentIsDone) {
      event.preventDefault();
      pay();
    }
  });

  async function pay() {
    startLoading();
    try {
      const clientSecret = document.getElementById(
        "payment_intent_secret"
      ).value;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });
      stopLoading();

      if (error) {
        showError(error.message);
      } else {
        paymentIsDone = true;
        form.submit();
      }
    } catch (e) {
      stopLoading();
      showError(e.message);
    }
  }

  function showError(str) {
    errorsContainer.textContent = str;
    setTimeout(() => {
      if (errorsContainer.textContent === str) {
        errorsContainer.textContent = "";
      }
    }, 7000);
  }

  function startLoading() {
    isLoading = true;
    submitButton.disabled = true;
  }

  function stopLoading() {
    isLoading = false;
    submitButton.disabled = false;
  }
};
