export function setupFearTracker() {
  const snakes = document.querySelectorAll<HTMLDivElement>('.snake')
  const inactiveSide = document.querySelector<HTMLDivElement>('.inactive-side')!
  const activeSide = document.querySelector<HTMLDivElement>('.active-side')!
  
  let draggedElement: HTMLDivElement | null = null
  let dragOffset = { x: 0, y: 0 }

  snakes.forEach(snake => {
    snake.draggable = true
    snake.style.cursor = 'grab'

    snake.addEventListener('dragstart', (e) => {
      draggedElement = snake
      snake.style.cursor = 'grabbing'
      snake.style.opacity = '0.5'
      
      const rect = snake.getBoundingClientRect()
      dragOffset.x = e.clientX - rect.left
      dragOffset.y = e.clientY - rect.top
    })

    snake.addEventListener('dragend', () => {
      snake.style.cursor = 'grab'
      snake.style.opacity = '1'
      draggedElement = null
    })
  })

  function setupDropZone(dropZone: HTMLDivElement, side: 'inactive' | 'active') {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.style.backgroundColor = '#f0f0f0'
    })

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = ''
    })

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.style.backgroundColor = ''
      
      if (draggedElement) {
        draggedElement.dataset.side = side
        dropZone.appendChild(draggedElement)
      }
    })
  }

  setupDropZone(inactiveSide, 'inactive')
  setupDropZone(activeSide, 'active')
}