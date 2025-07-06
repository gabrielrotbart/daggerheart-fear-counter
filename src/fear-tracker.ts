import OBR from "@owlbear-rodeo/sdk";

export function setupFearTracker() {
  const tokens = document.querySelectorAll<HTMLDivElement>(".token");
  const inactiveSide = document.querySelector<HTMLDivElement>(".inactive-side")!;
  const activeSide = document.querySelector<HTMLDivElement>(".active-side")!;
  const activeCountElement = document.querySelector<HTMLSpanElement>("#active-count")!;

  let draggedElement: HTMLDivElement | null = null;
  let draggedTokens: HTMLDivElement[] = [];
  let dragOffset = { x: 0, y: 0 };
  let isGM = false;

  // Initialize OBR integration
  OBR.onReady(async () => {
    // Check if player is GM
    const role = await OBR.player.getRole();
    isGM = role === "GM";

    if (isGM) {
      const settings = document.querySelector<HTMLDivElement>(".settings");
      if (!settings) return;
      settings.style.visibility = "visible";
    }
    // Set up drag functionality based on role
    setupTokenInteraction();

    // Load saved state from room metadata
    loadFearState();

    // Listen for state changes from other players
    OBR.room.onMetadataChange((metadata) => {
      if (metadata["fear-tracker/active-count"]) {
        updateDisplayFromState(metadata["fear-tracker/active-count"] as number);
      }
    });
  });

  async function loadFearState() {
    try {
      const metadata = await OBR.room.getMetadata();
      const savedCount = metadata["fear-tracker/active-count"] as number;
      if (savedCount !== undefined) {
        updateDisplayFromState(savedCount);
      }
    } catch (error) {
      console.error("Error loading fear state:", error);
    }
  }

  async function saveFearState(activeCount: number) {
    // Only GMs can save state changes
    if (!isGM) {
      return;
    }

    try {
      await OBR.room.setMetadata({
        "fear-tracker/active-count": activeCount,
      });
    } catch (error) {
      console.error("Error saving fear state:", error);
    }
  }

  function updateDisplayFromState(activeCount: number) {
    // Reset all tokens to inactive
    tokens.forEach((token) => {
      token.dataset.side = "inactive";
      inactiveSide.appendChild(token);
    });

    // Move the specified number of tokens to active side
    const tokensArray = Array.from(tokens);
    for (let i = 0; i < Math.min(activeCount, tokensArray.length); i++) {
      const token = tokensArray[i];
      token.dataset.side = "active";
      activeSide.appendChild(token);
    }

    activeCountElement.textContent = activeCount.toString();
  }

  function updateActiveCount() {
    const activeTokens = document.querySelectorAll('.token[data-side="active"]');
    const count = activeTokens.length;
    activeCountElement.textContent = count.toString();

    // Save state to room metadata
    saveFearState(count);
  }

  function setupTokenInteraction() {
    // Add visual indicator for player role

    tokens.forEach((token) => {
      if (isGM) {
        // GM can drag tokens
        token.draggable = true;
        token.style.cursor = "grab";

        token.addEventListener("dragstart", (e) => {
          draggedElement = token;
          token.style.cursor = "grabbing";

          // Only apply multi-token grabbing if token is on inactive side
          if (token.dataset.side === "inactive") {
            const inactiveTokens = Array.from(inactiveSide.querySelectorAll<HTMLDivElement>(".token"));
            const tokenIndex = inactiveTokens.indexOf(token);

            // Grab tokens from the clicked token to the rightmost
            draggedTokens = inactiveTokens.slice(tokenIndex);

            // Apply visual feedback to all grabbed tokens
            draggedTokens.forEach((t) => {
              t.style.opacity = "0.5";
              const img = t.querySelector("img");
              if (img) img.style.filter = "brightness(0) saturate(100%) invert(91%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(91%)";
            });
          } else {
            // Single token grab for active side
            draggedTokens = [token];
            token.style.opacity = "0.5";
            const img = token.querySelector("img");
            if (img) img.style.filter = "brightness(0) saturate(100%) invert(91%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(96%) contrast(91%)";
          }

          const rect = token.getBoundingClientRect();
          dragOffset.x = e.clientX - rect.left;
          dragOffset.y = e.clientY - rect.top;
        });

        token.addEventListener("dragend", () => {
          token.style.cursor = "grab";
          // Reset opacity and filter for all dragged tokens
          draggedTokens.forEach((t) => {
            t.style.opacity = "1";
            const img = t.querySelector("img");
            if (img) img.style.filter = "";
          });
          draggedElement = null;
          draggedTokens = [];
        });
      } else {
        // Players cannot drag tokens - make them non-interactive
        token.draggable = false;
        token.style.cursor = "default";
        token.style.opacity = "0.8";
      }
    });

    if (isGM) {
      setupDropZone(inactiveSide, "inactive");
      setupDropZone(activeSide, "active");
    }
  }

  function setupDropZone(dropZone: HTMLDivElement, side: "inactive" | "active") {
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      // Only highlight the target zone, not the source zone
      if (draggedElement && draggedElement.dataset.side !== side) {
        dropZone.style.backgroundColor = "#f0f0f0";
      }
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.style.backgroundColor = "";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = "";

      if (draggedElement && draggedTokens.length > 0) {
        // Move all dragged tokens to the drop zone
        draggedTokens.forEach((token) => {
          token.dataset.side = side;
          dropZone.appendChild(token);
        });
        updateActiveCount();
      }
    });
  }

  updateActiveCount();
}
