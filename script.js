// write javascript here
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const tableBody = document.querySelector(".tbody");
  const noDataFound = document.querySelector(".tr-2");
  const totalBalance = document.querySelector(".total");
  const clearButton = document.querySelector(".clear-all-data");
  let balance = 0;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Input value
    const name = form.querySelector(".name").value;
    const amount = parseFloat(form.querySelector(".amount").value);
    const date = form.querySelector(".date").value;
    const category = form.querySelector(".select").value;

    if (!name || !amount || !date || !category || category === "category") {
      alert("Please fill up all the fields");
      return;
    }

    if (name && amount && date && category) {
      const rupeesAmount = `₹ ${amount}`;

      // create row
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
      <td>${name}</td>
      <td>${rupeesAmount}</td>
      <td>${date}</td>
      <td class="td-${category}">${category}</td>
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
      `;
      newRow.classList.add("tr-new");

      noDataFound.classList.add("hidden");

      //add row
      tableBody.appendChild(newRow);

      //Update total balance
      if (category === "Income") {
        balance += amount;
      } else if (category === "Expense") {
        balance -= amount;
      }

      // Display balance
      totalBalance.textContent = balance.toFixed(2);

      // clear fields
      form.reset();
    }
  });

  // Edit button
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
      const row = e.target.closest("tr");
      const name = row.children[0].textContent;
      const amountString = row.children[1].textContent.replace("₹", "");
      const amount = parseFloat(amountString);
      const date = row.children[2].textContent;
      const category = row.children[3].textContent;

      form.querySelector(".name").value = name;
      form.querySelector(".amount").value = amount;
      form.querySelector(".date").value = date;
      form.querySelector(".select").value = category;

      // Update balance
      if (category === "Income") {
        balance -= amount;
      } else if (category === "Expense") {
        balance += amount;
      }

      // Display balance
      totalBalance.textContent = balance.toFixed(2);

      // Remove row
      row.remove();

      if (tableBody.children.length === 1) {
        noDataFound.classList.remove("hidden");
        tableBody.appendChild(noDataFound);
      }
    }
  });

  // Delete button
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
      const row = e.target.closest("tr");
      const amountString = row.children[1].textContent.replace("₹", ""); // Remove the Rupee symbol
      const amount = parseFloat(amountString);

      if (!isNaN(amount)) {
        const category = row.children[3].textContent;

        // Update balance
        if (category === "Income") {
          balance -= amount;
        } else if (category === "Expense") {
          balance += amount;
        }

        // Display balance
        totalBalance.textContent = balance.toFixed(2);

        // Remove row
        row.remove();

        if (tableBody.children.length === 1) {
          noDataFound.classList.remove("hidden");
          tableBody.appendChild(noDataFound);
        }
      }
    }
  });

  // Clear all data

  clearButton.addEventListener("click", function () {
    // Reset balance
    balance = 0;
    totalBalance.textContent = balance.toFixed(2);

    // Remove all table rows
    const rows = tableBody.getElementsByTagName("tr");
    for (let i = rows.length - 1; i > 0; i--) {
      tableBody.removeChild(rows[i]);
    }

    noDataFound.classList.remove("hidden");
    tableBody.appendChild(noDataFound);
  });
});
