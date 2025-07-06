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
