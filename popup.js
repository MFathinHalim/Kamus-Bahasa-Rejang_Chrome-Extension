document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("translateForm");
  const promptInput = document.getElementById("promptInput");
  const modeSelect = document.getElementById("modeSelect");
  const resultDiv = document.getElementById("result");
  const toggleModeBtn = document.getElementById("toggleModeBtn");

  let isRejangMode = false; // Boolean toggle for mode (Rejang vs Normal)

  const updateDropdown = () => {
    modeSelect.innerHTML = ""; // Reset dropdown options
    if (isRejangMode) {
      modeSelect.innerHTML = `
        <option value="id">Indonesia</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
      `;
      toggleModeBtn.textContent = "Translate from Rejang";
      toggleModeBtn.classList.add("rejang-mode");
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
      toggleModeBtn.textContent = "Translate to Rejang";
      toggleModeBtn.classList.remove("rejang-mode");
    }
    resultDiv.classList.add("hide")
  };

  toggleModeBtn.addEventListener("click", () => {
    isRejangMode = !isRejangMode; // Toggle between modes
    updateDropdown();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    const selectedLang = modeSelect.value;
    if (!prompt) return alert("Please enter a prompt.");

    try {
      resultDiv.innerHTML = "Translating...";

      const langMode = isRejangMode ? "rejang" : selectedLang; // Switch between Rejang or selected language
      const endpoint = `https://kamusrejang.vercel.app/api/word/translate/${langMode}?word=${encodeURIComponent(prompt)}&lang=${selectedLang}`;

      const response = await fetch(endpoint);
      const data = await response.json();
      resultDiv.innerHTML = data.result ? `${data.result}` : "Translation not found.";
      resultDiv.classList.remove("hide")
    } catch (error) {
      resultDiv.innerHTML = "Failed to fetch translation.";
    }
  });

  updateDropdown(); // Initial setup on page load
});
