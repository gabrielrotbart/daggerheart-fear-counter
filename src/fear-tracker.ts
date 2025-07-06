export function setupFearTracker() {
  const tokens = document.querySelectorAll<HTMLDivElement>(".token");
  const inactiveSide = document.querySelector<HTMLDivElement>(".inactive-side")!;
  const activeSide = document.querySelector<HTMLDivElement>(".active-side")!;
  const activeCountElement = document.querySelector<HTMLSpanElement>("#active-count")!;

  let draggedElement: HTMLDivElement | null = null;
  let draggedTokens: HTMLDivElement[] = [];
  let dragOffset = { x: 0, y: 0 };

  function updateActiveCount() {
    const activeTokens = document.querySelectorAll('.token[data-side="active"]');
    console.log("activeTokens :>> ", activeTokens.length.toString());
    activeCountElement.textContent = activeTokens.length.toString();
  }

  tokens.forEach((token) => {
    token.draggable = true;
    token.style.cursor = "grab";

    token.addEventListener("dragstart", (e) => {
      draggedElement = token;
      token.style.cursor = "grabbing";
      
      // Only apply multi-token grabbing if token is on inactive side
      if (token.dataset.side === "inactive") {
        const inactiveTokens = Array.from(inactiveSide.querySelectorAll<HTMLDivElement>(".token"));
        const tokenIndex = inactiveTokens.indexOf(token);
        const tokensFromRight = inactiveTokens.length - tokenIndex;
        
        // Grab tokens from the clicked token to the rightmost
        draggedTokens = inactiveTokens.slice(tokenIndex);
        
        // Apply visual feedback to all grabbed tokens
        draggedTokens.forEach(t => t.style.opacity = "0.5");
      } else {
        // Single token grab for active side
        draggedTokens = [token];
        token.style.opacity = "0.5";
      }

      const rect = token.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
    });

    token.addEventListener("dragend", () => {
      token.style.cursor = "grab";
      // Reset opacity for all dragged tokens
      draggedTokens.forEach(t => t.style.opacity = "1");
      draggedElement = null;
      draggedTokens = [];
    });
  });

  function setupDropZone(dropZone: HTMLDivElement, side: "inactive" | "active") {
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = "#f0f0f0";
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.style.backgroundColor = "";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = "";

      if (draggedElement && draggedTokens.length > 0) {
        // Move all dragged tokens to the drop zone
        draggedTokens.forEach(token => {
          token.dataset.side = side;
          dropZone.appendChild(token);
        });
        updateActiveCount();
      }
    });
  }

  setupDropZone(inactiveSide, "inactive");
  setupDropZone(activeSide, "active");

  updateActiveCount();
}
