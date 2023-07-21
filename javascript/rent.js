document.addEventListener('DOMContentLoaded', () => {
    const selectedTableBody = document.getElementById('selectedTableBody');
    const params = new URLSearchParams(window.location.search);
    const selectedData = JSON.parse(params.get('selectedData'));

    if (selectedData) {
      selectedData.forEach((data) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${data.serialNo}</td>
          <td>${data.title}</td>
          <td>${data.author}</td>
          <td>${data.publishedDate}</td>
          <td>${data.category}</td>
        `;
        selectedTableBody.appendChild(row);
      });
    }
  });

document.getElementById("rentButton").onclick = function () {
    location.href = "../html/library.html";
};