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
    const model = document.getElementById("model").value === "true" ? 0 : 1;

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
    
    const endpoint = model === 0 ? "blackScholesPricing" : "monteCarloPricing"; 
    const url = new URL(`https://3.89.65.83/${endpoint}`);
    url.search = new URLSearchParams(params).toString();

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
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
    });      
}