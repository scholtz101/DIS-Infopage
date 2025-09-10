// Lightbox-Funktionalität für die Bildergalerie

document.addEventListener('DOMContentLoaded', function() {
  initLightbox();
});

function initLightbox() {
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  if (!lightboxTriggers.length || !lightboxOverlay) {
    console.warn('Lightbox-Elemente nicht gefunden');
    return;
  }
  
  let currentIndex = 0;
  const triggers = Array.from(lightboxTriggers);
  
  // Öffnen der Lightbox
  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      currentIndex = index;
      openLightbox(this);
    });
  });
  
  // Lightbox schließen mit X-Button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', function() {
      closeLightbox();
    });
  }
  
  // Lightbox schließen mit Klick außerhalb
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeLightbox();
      }
    });
  }
  
  // Navigation in der Lightbox
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      openLightbox(triggers[currentIndex]);
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % triggers.length;
      openLightbox(triggers[currentIndex]);
    });
  }
  
  // Tastaturnavigation
  document.addEventListener('keydown', function(e) {
    if (lightboxOverlay.hidden) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        if (lightboxPrev) lightboxPrev.click();
        break;
      case 'ArrowRight':
        if (lightboxNext) lightboxNext.click();
        break;
    }
  });
  
  function openLightbox(trigger) {
    const imgSrc = trigger.getAttribute('href');
    const title = trigger.getAttribute('data-title') || '';
    const description = trigger.getAttribute('data-description') || '';
    
    // Bild mit Lade-Animation
    lightboxImage.src = '';
    lightboxImage.alt = title;
    setTimeout(() => {
      lightboxImage.src = imgSrc;
    }, 100);
    
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxOverlay.hidden = false;
    document.body.classList.add('no-scroll');
    
    // Prüfen, ob Navigation angezeigt werden soll
    if (lightboxPrev) lightboxPrev.hidden = triggers.length <= 1;
    if (lightboxNext) lightboxNext.hidden = triggers.length <= 1;
    
    console.log('Lightbox geöffnet');
  }
  
  function closeLightbox() {
    if (lightboxOverlay) {
      lightboxOverlay.hidden = true;
      document.body.classList.remove('no-scroll');
      console.log('Lightbox geschlossen');
    }
  }
  
  // Exportiere die Funktionen für globalen Zugriff
  window.thfLightbox = {
    open: function(index) {
      if (index >= 0 && index < triggers.length) {
        openLightbox(triggers[index]);
      }
    },
    close: closeLightbox
  };
  
  console.log('Lightbox initialisiert');
}