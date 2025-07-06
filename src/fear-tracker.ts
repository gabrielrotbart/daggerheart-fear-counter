export function setupFearTracker() {
  const tokens = document.querySelectorAll<HTMLDivElement>(".token");
  const inactiveSide = document.querySelector<HTMLDivElement>(".inactive-side")!;
  const activeSide = document.querySelector<HTMLDivElement>(".active-side")!;
  const activeCountElement = document.querySelector<HTMLSpanElement>("#active-count")!;

  let draggedElement: HTMLDivElement | null = null;
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
      token.style.opacity = "0.5";

      const rect = token.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
    });

    token.addEventListener("dragend", () => {
      token.style.cursor = "grab";
      token.style.opacity = "1";
      draggedElement = null;
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

      if (draggedElement) {
        draggedElement.dataset.side = side;
        dropZone.appendChild(draggedElement);
        updateActiveCount();
      }
    });
  }

  setupDropZone(inactiveSide, "inactive");
  setupDropZone(activeSide, "active");

  updateActiveCount();
}
