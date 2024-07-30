document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calculationForm").addEventListener("submit", (event) => {
        calulationHandler(event);
    })
});

const calulationHandler = (event) => {
    event.preventDefault();

    const stock_price = document.getElementById("stock_price").value;
    const strike_price = document.getElementById("strike_price").value;
    const time_to_expiration = document.getElementById("time_to_expiration").value;
    const risk_free_rate = document.getElementById("risk_free_rate").value;
    const dividend_yield = document.getElementById("dividend_yield").value;
    const volatility = document.getElementById("volatility").value;
    const greeks = document.getElementById("greeks").value === "true" ? 1 : 0;
    const type = document.getElementById("type").value === "true" ? 0 : 1;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const res = JSON.parse(xhttp.responseText);
            
            document.getElementById("option-price").innerText = `PRICE: ${res.Price}`;
            document.getElementById("option-delta").innerText = `DELTA: ${res.Delta}`;
            document.getElementById("option-gamma").innerText = `GAMMA: ${res.Gamma}`;
            document.getElementById("option-theta").innerText = `THETA: ${res.Theta}`;
            document.getElementById("option-vega").innerText = `VEGA: ${res.Vega}`;
            document.getElementById("option-rho").innerText = `RHO: ${res.Rho}`;
        }
    };

    const params = new URLSearchParams({
        "stock_price": stock_price,
        "strike_price": strike_price,
        "time_to_expiration": time_to_expiration,
        "risk_free_rate": risk_free_rate,
        "dividend_yield": dividend_yield,
        "volatility": volatility,
        "include_greeks": greeks,
        "option_type": type
    }).toString();

    xhttp.open("GET", `http://127.0.0.1:5000/blackScholesPricing?${params}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}