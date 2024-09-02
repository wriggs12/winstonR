document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calculationForm").addEventListener("submit", (event) => {
        calulationHandler(event);
    });
    document.getElementById("emailForm").addEventListener("submit", (event) => {
        subscribeHandler(event);
    });
});

const calulationHandler = (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('option-submit');
    setLoadingState(submitButton, true);
    submitButton.value = "Calculating...";

    const formData = new FormData(event.target);
    const url = new URL(`https://optionsapi-qjy4v3d7qa-uc.a.run.app/${formData.get("model")}`);
    url.search = new URLSearchParams(formData).toString();

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("option-price").innerText = `PRICE: ${data.Price}`;
        document.getElementById("option-delta").innerText = `DELTA: ${data.Delta}`;
        document.getElementById("option-gamma").innerText = `GAMMA: ${data.Gamma}`;
        document.getElementById("option-theta").innerText = `THETA: ${data.Theta}`;
        document.getElementById("option-vega").innerText = `VEGA: ${data.Vega}`;
        document.getElementById("option-rho").innerText = `RHO: ${data.Rho}`;
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        setLoadingState(submitButton, false);
        submitButton.value = "Calculate";
    });
}

const setLoadingState = (button, isLoading) => {
    if (isLoading)
    {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        button.style.opacity = "0.7";
    }
    else
    {
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.opacity = "1";
    }
};

const subscribeHandler = (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('email-submit');
    setLoadingState(submitButton, true);
    submitButton.value = "Subscribing...";

    const formData = new FormData(event.target);
    const url = new URL(`https://barsapi-3kgcirzfmq-uc.a.run.app/subscribe`);
    const email = formData.get('email');

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("email-message").innerText = data.data.message;
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        setLoadingState(submitButton, false);
        submitButton.value = "Subscribe";
    });
};
