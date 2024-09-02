document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calculationForm").addEventListener("submit", (event) => {
        calulationHandler(event);
    })
});

const calulationHandler = (event) => {
    event.preventDefault();

    const submitButton = document.querySelector('input[type="submit"]');
    setLoadingState(submitButton, true);

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
    });
}

const setLoadingState = (button, isLoading) => {
    if (isLoading)
    {
        button.value = "Calculating...";
        button.disabled = true;
        button.style.cursor = "not-allowed";
        button.style.opacity = "0.7";
    }
    else
    {
        button.value = "Calculate";
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.opacity = "1";
    }
};