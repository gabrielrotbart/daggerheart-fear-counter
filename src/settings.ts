import OBR from "@owlbear-rodeo/sdk";

// Available token options
const availableTokens = [
  { name: "Snake Spiral", path: "/snake-spiral.svg" },
  { name: "Annoyed Skull", path: "/tokens/annoyed-skull.svg" },
  { name: "Day Dead Skull", path: "/tokens/day-dead-skull.svg" },
  { name: "Evil Skull", path: "/tokens/evil-skull.svg" },
  { name: "Fat Skull", path: "/tokens/fat-skull.svg" },
  { name: "Skewed Skull", path: "/tokens/skewed-skull.svg" },
  { name: "Skull Shield", path: "/tokens/skull-shield.svg" },
];

let currentTokenPath = "/snake-spiral.svg";

export function setupSettings() {
  createSettingsContent();
  setupTokenSelection();
}

function createSettingsContent() {
  const settingsView = document.querySelector("#settings-view")!;

  settingsView.innerHTML = `
    <div class="settings-header">
      <button id="back-button" onclick="showMain()">&larr; Back</button>
    </div>
    <div class="settings-body">
      <div class="token-selector">
        ${availableTokens
          .map(
            (token) => `
          <div class="token-option" data-token-path="${token.path}" title="${token.name}">
            <img src="${token.path}" alt="${token.name}" />
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function setupTokenSelection() {
  const tokenOptions = document.querySelectorAll<HTMLDivElement>(".token-option");

  // Set initial selection
  updateTokenSelection();

  tokenOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const tokenPath = option.dataset.tokenPath!;
      currentTokenPath = tokenPath;
      updateTokenSelection();
      updateAllTokenImages();

      // Save preference to room metadata if user is GM
      saveTokenPreference(tokenPath);
    });
  });
}

function updateTokenSelection() {
  const tokenOptions = document.querySelectorAll<HTMLDivElement>(".token-option");

  tokenOptions.forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.tokenPath === currentTokenPath) {
      option.classList.add("selected");
    }
  });
}

function updateAllTokenImages() {
  const allTokenImages = document.querySelectorAll<HTMLImageElement>(".token img");

  allTokenImages.forEach((img) => {
    img.src = currentTokenPath;
  });
}

async function saveTokenPreference(tokenPath: string) {
  try {
    console.log("Saving token preference:", tokenPath);
    await OBR.room.setMetadata({
      "fear-tracker/token-style": tokenPath,
    });
    console.log("Token preference saved successfully");
  } catch (error) {
    console.log("Could not save token preference:", error);
  }
}

export function loadTokenPreference() {
  return currentTokenPath;
}

export function setTokenPath(path: string) {
  console.log("Setting token path to:", path);
  currentTokenPath = path;
  // Update selection in settings if currently visible
  updateTokenSelection();
}

export async function loadTokenPreferenceFromMetadata() {
  try {
    const metadata = await OBR.room.getMetadata();
    const savedTokenPath = metadata["fear-tracker/token-style"] as string;
    console.log("Loading token preference from metadata:", savedTokenPath);
    if (savedTokenPath) {
      setTokenPath(savedTokenPath);
      updateAllTokenImages();
      return savedTokenPath;
    }
  } catch (error) {
    console.log("Could not load token preference from metadata:", error);
  }
  return null;
}
