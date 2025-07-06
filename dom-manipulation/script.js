let quotes = [];

// Load quotes from localStorage on startup
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    // Fallback to default if no quotes in storage
    quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
      { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
      { text: "If you want to lift yourself up, lift up someone else.", category: "Motivation" }
    ];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  quoteDisplay.innerHTML = `"${quote.text}"<br><em>(${quote.category})</em>`;

  // Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  alert("Quote added!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showRandomQuote();
}

// Dynamically create the form
function createAddQuoteForm() {
  const form = document.createElement("div");

  form.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote">
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category">
    <button id="addQuoteBtn">Add Quote</button>
    <br><br>
    <button id="exportBtn">Export Quotes to JSON</button>
    <input type="file" id="importFile" accept=".json">
  `;

  document.body.appendChild(form);

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid format");

      imported.forEach(q => {
        if (q.text && q.category) {
          quotes.push(q);
        }
      });

      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      alert("Failed to import. Please upload a valid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  quoteDisplay = document.getElementById("quoteDisplay");
  newQuoteBtn = document.getElementById("newQuote");

  loadQuotes();
  createAddQuoteForm();
  showRandomQuote();

  newQuoteBtn.addEventListener("click", showRandomQuote);
});
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Motivation" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote (respecting filter)
function showRandomQuote() {
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = randomQuote
    ? randomQuote.text
    : "No quotes available for this category.";
}

// Populate category dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
  });

  // Restore previous selection
  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categorySelect.value = savedCategory;
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Add new quote
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  }
});

// Export quotes
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
});

// Import quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Init on load
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();
});
// Dummy server URL (you can use your own or JSONPlaceholder)
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Placeholder endpoint

function fetchQuotesFromServer() {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = "Syncing with server...";

  // Simulate server request
  fetch(serverUrl)
    .then((response) => response.json())
    .then((data) => {
      // Simulate that server returns quotes in a compatible format
      const serverQuotes = data.slice(0, 5).map((item, index) => ({
        text: item.title,
        category: `Category ${index + 1}`
      }));

      // Merge and deduplicate quotes
      const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
      const mergedQuotes = [...localQuotes];

      serverQuotes.forEach((quote) => {
        const exists = localQuotes.some(
          (q) => q.text === quote.text && q.category === quote.category
        );
        if (!exists) {
          mergedQuotes.push(quote);
        }
      });

      // Save to localStorage
      localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
      quotes = mergedQuotes;

      // Update UI
      populateCategories();
      filterQuotes();
      syncStatus.textContent = "Sync complete: quotes updated from server.";
    })
    .catch((error) => {
      console.error("Error syncing from server:", error);
      syncStatus.textContent = "Sync failed. Please try again.";
    });
}
