"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  const tableBody = document.querySelector(".tbody");
  const noDataFound = document.querySelector(".tr-2");
  const totalBalance = document.querySelector(".total");
  const clearButton = document.querySelector(".clear-all-data");
  let balance = 0;
  let editMode = false;
  let editedRow = null;

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

    if (editMode && editedRow) {
      // Update existing row
      const oldAmountString = editedRow.children[1].textContent.replace(
        "₹",
        ""
      );
      const oldAmount = parseFloat(oldAmountString);
      const categoryBeforeEdit = editedRow.children[3].textContent;

      editedRow.children[0].textContent = name;
      editedRow.children[1].textContent = `₹ ${amount}`;
      editedRow.children[2].textContent = date;
      editedRow.children[3].textContent = category;

      // Update category class
      editedRow.children[3].classList.remove(`td-${categoryBeforeEdit}`);
      editedRow.children[3].classList.add(`td-${category}`);

      // Update balance
      const categoryAfterEdit = category;
      if (categoryBeforeEdit === "Income") {
        balance -= oldAmount;
      } else if (categoryBeforeEdit === "Expense") {
        balance += oldAmount;
      }

      if (categoryAfterEdit === "Income") {
        balance += amount;
      } else if (categoryAfterEdit === "Expense") {
        balance -= amount;
      }
      // Update total balance with the new balance
      totalBalance.textContent = balance.toFixed(2);

      // Clear edit mode
      editMode = false;
      editedRow = null;
    } else {
      // Create new row
      const rupeesAmount = `₹ ${amount}`;
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

      // Add new row
      tableBody.appendChild(newRow);

      // Update balance
      if (category === "Income") {
        balance += amount;
      } else if (category === "Expense") {
        balance -= amount;
      }
      totalBalance.textContent = balance.toFixed(2);
    }

    // Clear form fields
    form.reset();
  });

  // Edit button
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
      editMode = true;
      const row = e.target.closest("tr");
      const name = row.children[0].textContent;
      const amountString = row.children[1].textContent.replace("₹", "");
      const amount = parseFloat(amountString);
      const date = row.children[2].textContent;
      const category = row.children[3].textContent;

      // Fill form with row data
      form.querySelector(".name").value = name;
      form.querySelector(".amount").value = amount;
      form.querySelector(".date").value = date;
      form.querySelector(".select").value = category;

      // Store edited row
      editedRow = row;
    }
  });

  // Delete button
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
      const row = e.target.closest("tr");
      const amountString = row.children[1].textContent.replace("₹", "");
      const amount = parseFloat(amountString);

      if (!isNaN(amount)) {
        const category = row.children[3].textContent;

        if (category === "Income") {
          balance -= amount;
        } else if (category === "Expense") {
          balance += amount;
        }

        totalBalance.textContent = balance.toFixed(2);

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
    balance = 0;
    totalBalance.textContent = balance.toFixed(2);
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = rows.length - 1; i > 0; i--) {
      tableBody.removeChild(rows[i]);
    }

    noDataFound.classList.remove("hidden");
    tableBody.appendChild(noDataFound);
  });
});
