document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calculationForm").addEventListener("submit", (event) => {
        calculationHandler(event);
    });

    fetchAllStockData();
});

const calculationHandler = (event) => {
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
    if (isLoading) {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        button.style.opacity = "0.7";
    }
    else {
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.opacity = "1";
    }
};

const fetchAllStockData = () => {
    document.getElementById('stock-data').innerHTML = '';
    const watchlist = ["AAPL", "FICO", "VOO", "SPY"];

    const now = new Date();
    document.getElementById('last-updated').textContent = `As of: ${now.toLocaleTimeString()}`;

    const promise = fetchStockData(watchlist);

    const loadingTimeout = setTimeout(() => {
        if (document.getElementById('stock-data').children.length === 0) {
            const loadingRow = document.createElement('tr');
            loadingRow.id = 'loading-row';
            loadingRow.innerHTML = `<td colspan="7" style="text-align: center;">Loading stock data...</td>`;
            document.getElementById('stock-data').appendChild(loadingRow);
        }
    }, 300);

    promise.finally(() => {
        clearTimeout(loadingTimeout);
        const loadingRow = document.getElementById('loading-row');
        if (loadingRow) loadingRow.remove();
    });
}


const fetchStockData = async (symbols) => {
    try {
        const response = await fetch(`https://optionsapi-qjy4v3d7qa-uc.a.run.app/fetchEquityData?ticker=${symbols.join(",")}`);

        if (!response.ok) {
            throw new Error(`Error fetching data for ${symbols}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.data)) {
            throw new Error("Unexpected response format");
        }

        for (const stock of data.data) {
            const stockData = {
                symbol: stock.symbol,
                price: stock.c,
                change: stock.d,
                percentChange: stock.dp,
                high: stock.h,
                low: stock.l
            };

            renderStockRow(stockData);
        }

        return data.data;
    }
    catch (error) {
        console.error(error);
    }
}

const renderStockRow = (data) => {
    const stockTable = document.getElementById('stock-data');

    let row = document.querySelector(`tr[data-symbol="${data.symbol}"]`);

    if (!row) {
        row = document.createElement('tr');
        row.setAttribute('data-symbol', data.symbol);
        stockTable.appendChild(row);
    }

    const formattedPrice = data.price.toFixed(2);
    const formattedChange = data.change.toFixed(2);
    const formattedPercentChange = data.percentChange.toFixed(2);
    const formattedHigh = data.high.toFixed(2);
    const formattedLow = data.low.toFixed(2);

    const changeClass = data.change >= 0 ? 'positive' : 'negative';
    const changeSign = data.change >= 0 ? '+' : '';

    row.innerHTML = `
      <td>${data.symbol}</td>
      <td>$${formattedPrice}</td>
      <td class="${changeClass}">${changeSign}${formattedChange}</td>
      <td class="${changeClass}">${changeSign}${formattedPercentChange}%</td>
      <td>$${formattedHigh}</td>
      <td>$${formattedLow}</td>
    `;
}
