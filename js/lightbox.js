/**
 * Lightbox-Funktionalität mit Blätterfunktion
 */
document.addEventListener('DOMContentLoaded', function() {
  initLightbox();
});

// Globale Variablen für die Lightbox
let currentImageIndex = 0;
let galleryImages = [];

function initLightbox() {
  // Alle Lightbox-Trigger selektieren
  const lightboxTriggers = document.querySelectorAll('.gallery-item a, [data-lightbox]');
  
  if (lightboxTriggers.length === 0) {
    return; // Keine Lightbox-Elemente gefunden
  }
  
  // Bildergalerie-Array erstellen
  galleryImages = Array.from(lightboxTriggers).map(trigger => {
    return {
      src: trigger.getAttribute('href') || trigger.getAttribute('data-lightbox-src'),
      title: trigger.getAttribute('data-title') || '',
      caption: trigger.getAttribute('data-caption') || ''
    };
  });
  
  // Event-Listener für jedes Bild hinzufügen
  lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      currentImageIndex = index;
      openLightbox(currentImageIndex);
    });
  });
}

function openLightbox(index) {
  // Sicherstellen, dass der Index gültig ist
  currentImageIndex = index;
  const imageData = galleryImages[currentImageIndex];
  
  // Lightbox-Overlay erstellen
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  
  // Lightbox-Inhalt erstellen
  const content = document.createElement('div');
  content.className = 'lightbox-content';
  
  // Bild hinzufügen
  const img = document.createElement('img');
  img.src = imageData.src;
  img.alt = imageData.title || 'Bildansicht';
  content.appendChild(img);
  
  // Beschriftung hinzufügen, wenn vorhanden
  if (imageData.title || imageData.caption) {
    const captionEl = document.createElement('div');
    captionEl.className = 'lightbox-caption';
    
    if (imageData.title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = imageData.title;
      captionEl.appendChild(titleEl);
    }
    
    if (imageData.caption) {
      const captionText = document.createElement('p');
      captionText.textContent = imageData.caption;
      captionEl.appendChild(captionText);
    }
    
    content.appendChild(captionEl);
  }
  
  // Schließen-Button hinzufügen
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Lightbox schließen');
  closeBtn.setAttribute('type', 'button');
  
  // Navigationspfeile hinzufügen (nur wenn mehr als ein Bild vorhanden)
  if (galleryImages.length > 1) {
    // Zurück-Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Vorheriges Bild');
    prevBtn.setAttribute('type', 'button');
    
    // Weiter-Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Nächstes Bild');
    nextBtn.setAttribute('type', 'button');
    
    // Bildnummerierung hinzufügen
    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    
    // Event-Listener für die Navigationspfeile hinzufügen
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateGallery(-1);
    });
    
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateGallery(1);
    });
    
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(counter);
  }
  
  // Alles zum Overlay hinzufügen
  overlay.appendChild(closeBtn);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
  
  // Body-Scrolling deaktivieren
  document.body.classList.add('no-scroll');
  
  // Event-Listener für das Schließen über den Button hinzufügen
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });
  
  // Event-Listener für das Schließen über den Overlay-Hintergrund hinzufügen
  overlay.addEventListener('click', function(e) {
    // Nur schließen, wenn direkt auf den Overlay-Hintergrund geklickt wurde
    if (e.target === overlay) {
      closeLightbox();
    }
  });
  
  // Event-Listener für das Schließen über die ESC-Taste hinzufügen
  document.addEventListener('keydown', handleKeyDown);
}

function navigateGallery(direction) {
  // Aktuelle Lightbox schließen
  const overlays = document.querySelectorAll('.lightbox-overlay');
  overlays.forEach(overlay => {
    overlay.remove();
  });
  
  // Neuen Index berechnen (mit Überlauf-Handling)
  let newIndex = currentImageIndex + direction;
  
  // Zirkuläres Blättern
  if (newIndex < 0) {
    newIndex = galleryImages.length - 1;
  } else if (newIndex >= galleryImages.length) {
    newIndex = 0;
  }
  
  // Neue Lightbox öffnen
  openLightbox(newIndex);
}

function closeLightbox() {
  // Alle Lightbox-Overlays entfernen
  const overlays = document.querySelectorAll('.lightbox-overlay');
  overlays.forEach(overlay => {
    overlay.remove();
  });
  
  // Body-Scrolling wieder aktivieren
  document.body.classList.remove('no-scroll');
  
  // Event-Listener für die ESC-Taste entfernen
  document.removeEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
  // ESC-Taste gedrückt
  if (e.key === 'Escape') {
    closeLightbox();
  }
  
  // Pfeiltasten für Navigation
  if (galleryImages.length > 1) {
    if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
      navigateGallery(1);
    }
  }
}