// pharmacy_api.js

document.addEventListener('DOMContentLoaded', () => {
    const URL = "https://midas.minsal.cl/farmacia_v2/WS/getLocales.php";

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const pharmacies = data;

            const comunaFilter = document.getElementById('comuna-filter');
            const comunas = [...new Set(pharmacies.map(pharmacy => pharmacy.comuna_nombre))];
            comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaFilter.appendChild(option);
            });

            displayPharmacies(pharmacies);

            comunaFilter.addEventListener('change', () => {
                const selectedComuna = comunaFilter.value;
                const filteredPharmacies = pharmacies.filter(pharmacy => pharmacy.comuna_nombre === selectedComuna);
                displayPharmacies(filteredPharmacies);
            });
        })
        .catch(error => {
            console.error(error);
        });

    function displayPharmacies(pharmacies) {
        const apiDataDiv = document.getElementById("api-data");
        apiDataDiv.innerHTML = "";

        const table = document.createElement("table");
        table.classList.add('table', 'table-striped', 'table-bordered');

        const tableHeader = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["Nombre", "Comuna", "Dirección", "Horario de Apertura", "Horario de Cierre", "Teléfono", "Ubicación"].forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        const tableBody = document.createElement("tbody");
        pharmacies.forEach((item) => {
            const row = document.createElement("tr");
            ["local_nombre", "comuna_nombre", "local_direccion", "funcionamiento_hora_apertura", "funcionamiento_hora_cierre", "local_telefono"].forEach(data => {
                const td = document.createElement("td");
                td.textContent = item[data];
                row.appendChild(td);
            });

            const locationTd = document.createElement("td");
            const locationButton = document.createElement("a");
            locationButton.classList.add('btn', 'btn-primary');
            locationButton.textContent = "Ir";

            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.local_direccion)}`;
            locationButton.href = googleMapsUrl;
            locationButton.target = "_blank";
            locationTd.appendChild(locationButton);

            row.appendChild(locationTd);
            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);
        apiDataDiv.appendChild(table);
    }
});
