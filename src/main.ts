import "./style.css";
import { setupFearTracker } from "./fear-tracker.ts";
import { setupSettings } from "./settings.ts";

// Create main app structure and handle view switching
function createAppStructure() {
  const app = document.querySelector("#app")!;

  app.innerHTML = `
    <div id="main-view">
      <!-- Fear tracker content will be inserted here -->
    </div>
    <div id="settings-view" style="display: none;">
      <!-- Settings content will be inserted here -->
    </div>
  `;
}

function setupViewSwitching() {
  const mainView = document.querySelector<HTMLDivElement>("#main-view")!;
  const settingsView = document.querySelector<HTMLDivElement>("#settings-view")!;

  // Expose global functions for view switching
  (window as any).showSettings = () => {
    mainView.style.display = "none";
    settingsView.style.display = "block";
  };

  (window as any).showMain = () => {
    settingsView.style.display = "none";
    mainView.style.display = "block";
  };
}

// Initialize the app
createAppStructure();
setupViewSwitching();
setupFearTracker();
setupSettings();
