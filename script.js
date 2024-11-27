const cargoList = JSON.parse(localStorage.getItem('cargoList')) || [
  {
    id: 'CARGO001',
    name: 'Строительные материалы',
    status: 'В пути',
    origin: 'Москва',
    destination: 'Казань',
    departureDate: '2024-11-24',
  },
  {
    id: 'CARGO002',
    name: 'Хрупкий груз',
    status: 'Ожидает отправки',
    origin: 'Санкт-Петербург',
    destination: 'Екатеринбург',
    departureDate: '2024-11-26',
  },
];

const statusColors = {
  'Ожидает отправки': 'table-warning',
  'В пути': 'table-primary',
  Доставлен: 'table-success',
};

const cargoTable = document.getElementById('cargoTable');
const addCargoForm = document.getElementById('addCargoForm');
const statusFilter = document.getElementById('statusFilter');

function saveToLocalStorage() {
  localStorage.setItem('cargoList', JSON.stringify(cargoList));
}

function renderTable() {
  cargoTable.innerHTML = '';

  const filteredList = cargoList.filter((cargo) => {
    const filter = statusFilter.value;
    return filter === 'Все' || cargo.status === filter;
  });

  filteredList.forEach((cargo) => {
    const row = document.createElement('tr');
    row.classList.add(statusColors[cargo.status]);

    row.innerHTML = `
      <td>${cargo.id}</td>
      <td>${cargo.name}</td>
      <td>
        <select class="form-select" onchange="updateStatus('${
          cargo.id
        }', this.value)">
          <option ${
            cargo.status === 'Ожидает отправки' ? 'selected' : ''
          }>Ожидает отправки</option>
          <option ${cargo.status === 'В пути' ? 'selected' : ''}>В пути</option>
          <option ${
            cargo.status === 'Доставлен' ? 'selected' : ''
          }>Доставлен</option>
        </select>
      </td>
      <td>${cargo.origin}</td>
      <td>${cargo.destination}</td>
      <td>${cargo.departureDate}</td>
    `;

    cargoTable.appendChild(row);
  });
}

function updateStatus(id, newStatus) {
  const cargo = cargoList.find((item) => item.id === id);
  const currentDate = new Date();
  const departureDate = new Date(cargo.departureDate);

  if (newStatus === 'Доставлен' && departureDate > currentDate) {
    alert('Ошибка! Груз еще не отправлен. Пожалуйста, выберите другой статус.');
    renderTable();
    return;
  }

  cargo.status = newStatus;
  saveToLocalStorage();
  renderTable();
}

addCargoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('cargoName').value.trim();
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const departureDate = document.getElementById('departureDate').value;

  if (!name || !origin || !destination || !departureDate) {
    alert('Заполните все поля формы.');
    return;
  }

  const newCargo = {
    id: `CARGO${(cargoList.length + 1).toString().padStart(3, '0')}`,
    name,
    status: 'Ожидает отправки',
    origin,
    destination,
    departureDate,
  };

  cargoList.push(newCargo);
  saveToLocalStorage();
  renderTable();
  addCargoForm.reset();
});

statusFilter.addEventListener('change', renderTable);

renderTable();
