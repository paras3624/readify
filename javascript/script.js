const API_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';
const searchInput = document.getElementById('searchInput');
const bookTableBody = document.getElementById('bookTableBody');
const selectedTableBody = document.getElementById('selectedTableBody');
const loadingDiv = document.getElementById('loading');
const cartButton = document.getElementById('cartButton');
let startIndex = 0;
let maxResults = 30;
let loading = false;
let selectedRows = {};

function addToSelectedTable(row) {
  const selectedRow = row.cloneNode(true);
  selectedRow.querySelector('.selectBook').addEventListener('change', handleSelectedCheckboxChange);
  selectedRow.deleteCell(5);
  const serialNo = Object.keys(selectedRows).length + 1;
  selectedRow.cells[0].textContent = serialNo;
  selectedTableBody.appendChild(selectedRow);
  selectedRows[serialNo] = row;
}

function removeFromSelectedTable(row) {
  const serialNo = row.cells[0].textContent;
  const selectedRow = selectedTableBody.querySelector(`tr[data-id="${row.dataset.id}"]`);
  if (selectedRow) {
    selectedRow.remove();
  }
  delete selectedRows[serialNo];
}

async function fetchBooks() {
  loading = true;
  loadingDiv.style.display = 'block';
  const query = searchInput.value;
  const url = `${API_ENDPOINT}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    loadingDiv.style.display = 'none';
    if (data.items) {
      data.items.forEach((book, index) => {
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo.title || '';
        const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : '';
        const publishedDate = volumeInfo.publishedDate || '';
        const category = volumeInfo.categories ? volumeInfo.categories.join(', ') : '';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${startIndex + index + 1}</td>
          <td>${title}</td>
          <td>${author}</td>
          <td>${publishedDate}</td>
          <td>${category}</td>
          <td>${Math.floor(Math.random() * 21)}</td>
          <td><input type="checkbox" class="selectBook"></td>
        `;
        bookTableBody.appendChild(row);
        row.dataset.id = startIndex + index + 1;
        row.querySelector('.selectBook').addEventListener('change', handleCheckboxChange);
      });
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="7">No results found</td>`;
      bookTableBody.appendChild(row);
    }
    loading = false;
    startIndex += maxResults;
  } catch (error) {
    console.log('Error fetching books:', error);
    loadingDiv.style.display = 'none';
  }
}

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
    fetchBooks();
  }
});

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const row = checkbox.parentElement.parentElement;
  if (checkbox.checked) {
    addToSelectedTable(row);
  } else {
    removeFromSelectedTable(row);
  }
}

function handleSelectedCheckboxChange(event) {
  const checkbox = event.target;
  const row = checkbox.parentElement.parentElement;
  if (!checkbox.checked) {
    removeFromSelectedTable(row);
  }
}

searchInput.addEventListener('input', () => {
  startIndex = 0;
  bookTableBody.innerHTML = '';
  fetchBooks();
});

cartButton.addEventListener('click', () => {
  const selectedData = [];
  Object.values(selectedRows).forEach((row) => {
    const serialNo = row.cells[0].textContent;
    const title = row.cells[1].textContent;
    const author = row.cells[2].textContent;
    const publishedDate = row.cells[3].textContent;
    const category = row.cells[4].textContent;
    selectedData.push({
      serialNo,
      title,
      author,
      publishedDate,
      category,
    });
  });
  const encodedSelectedData = encodeURIComponent(JSON.stringify(selectedData));
  const rentPageUrl = `rent.html?selectedData=${encodedSelectedData}`;
  window.open(rentPageUrl, '_blank');
});