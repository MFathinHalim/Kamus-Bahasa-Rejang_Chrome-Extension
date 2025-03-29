document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("translateForm");
  const promptInput = document.getElementById("promptInput");
  const modeSelect = document.getElementById("modeSelect");
  const resultDiv = document.getElementById("result");
  const toggleModeBtn = document.getElementById("toggleModeBtn");

  let mode = "normal"; // "normal", "rejang", or "aksaraOnly"

  const updateDropdown = () => {
    modeSelect.innerHTML = ""; // Reset dropdown options
    if (mode === "rejang") {
      modeSelect.innerHTML = `
        <option value="id">Indonesia</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      `;
      toggleModeBtn.textContent = "Translate from Rejang";
      modeSelect.classList.remove("hide")
      toggleModeBtn.classList.add("rejang-mode");
    } else if (mode === "aksaraOnly") {
      modeSelect.innerHTML = `<option value="aksaraOnly">Aksara Only</option>`;
      modeSelect.classList.add("hide")
      toggleModeBtn.textContent = "Show Aksara Only";
      toggleModeBtn.classList.add("aksara-mode");
    } else {
      modeSelect.innerHTML = `
        <option value="auto">Auto Detect</option>
        <option value="id">Indonesia</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      `;
      modeSelect.classList.remove("hide")
      toggleModeBtn.textContent = "Translate to Rejang";
      toggleModeBtn.classList.remove("rejang-mode", "aksara-mode");
    }
    resultDiv.classList.add("hide");
  };

  toggleModeBtn.addEventListener("click", () => {
    if (mode === "normal") {
      mode = "rejang";
    } else if (mode === "rejang") {
      mode = "aksaraOnly";
    } else {
      mode = "normal";
    }
    updateDropdown();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    const selectedLang = modeSelect.value;
    if (!prompt) return alert("Please enter a prompt.");

    try {
      resultDiv.innerHTML = "Translating...";

      let endpoint;
      if (mode === "aksaraOnly") {
        endpoint = `https://kamusrejang.vercel.app/api/word/kaganga?word=${encodeURIComponent(prompt)}`;
      } else {
        const langMode = mode === "rejang" ? "rejang" : selectedLang; // Mode switching logic
        endpoint = `https://kamusrejang.vercel.app/api/word/translate/${langMode}?word=${encodeURIComponent(prompt)}&lang=${selectedLang}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (mode === "aksaraOnly") {
        resultDiv.innerHTML = data ? `<span class="rejang">${data}</span>` : "Aksara not found.";
      } else {
        resultDiv.innerHTML = data.result
          ? `${data.result} <br /> <span class="rejang">${data.aksara}</span>`
          : "Translation not found.";
      }
      resultDiv.classList.remove("hide");
    } catch (error) {
      resultDiv.innerHTML = "Failed to fetch translation.";
    }
  });

  updateDropdown(); // Initial setup on page load
});
