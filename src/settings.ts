export function setupSettings() {
  createSettingsContent();
}

function createSettingsContent() {
  const settingsView = document.querySelector("#settings-view")!;

  settingsView.innerHTML = `
    <div class="settings-body">
      <p>Settings panel coming soon...</p>
      <p>This is where configuration options will be added.</p>
    </div>
  `;
}
