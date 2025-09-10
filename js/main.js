document.addEventListener('DOMContentLoaded', function() {
  // Header und Footer laden
  loadComponent('includes/header.html', 'header-container');
  loadComponent('includes/footer.html', 'footer-container');
  
  // Initialisiere Tabs und Akkordeons direkt nach dem DOM-Laden
  initTabs();
  initAccordion();
});

// Pfade zu den Includes anpassen
function loadComponent(url, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      // Nach dem Laden des Headers die Eventlistener neu einrichten
      if (containerId === 'header-container') {
        initMenuFunctionality();
      }
    })
    .catch(error => {
      console.error('Fehler beim Laden der Komponente:', error);
      container.innerHTML = `<p>Fehler beim Laden des Inhalts. Bitte laden Sie die Seite neu.</p>`;
    });
}

// Menü-Funktionalität initialisieren
function initMenuFunctionality() {
  console.log("Menu-Funktionalität wird initialisiert...");
  
  // Burger Menü Toggle
  const burgerToggle = document.getElementById('burgerToggle');
  const megaOverlay = document.getElementById('megaOverlay');
  
  if (!burgerToggle || !megaOverlay) {
    console.error('Burger-Toggle oder Mega-Overlay nicht gefunden');
    return;
  }
  
  burgerToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
    // Toggle das Mega-Menü
    megaOverlay.hidden = isExpanded;
    this.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle Burger-Menü zu X
    this.classList.toggle('is-active');
    
    // Body Scroll sperren/freigeben
    document.body.classList.toggle('no-scroll', !isExpanded);
  });
  
  // Schließen-Button im Menü
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', function() {
      megaOverlay.hidden = true;
      burgerToggle.setAttribute('aria-expanded', 'false');
      burgerToggle.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    });
  }
  
  // Mobile-Version des Leichte-Sprache-Buttons
  const mobileLsToggle = document.getElementById('mobileLsToggle');
  const desktopLsToggle = document.getElementById('easySwitch');
  
  if (mobileLsToggle && desktopLsToggle) {
    // Status synchronisieren
    mobileLsToggle.addEventListener('click', function() {
      const isPressed = this.getAttribute('aria-pressed') === 'true';
      this.setAttribute('aria-pressed', !isPressed);
      desktopLsToggle.setAttribute('aria-pressed', !isPressed);
      toggleEasyLanguage(!isPressed);
    });
  }
  
  // Tree-Toggle Funktionalität für Mobile optimieren
  const treeToggles = document.querySelectorAll('.tree-toggle');
  
  treeToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const targetId = this.getAttribute('aria-controls');
      const targetContent = document.getElementById(targetId);
      
      this.setAttribute('aria-expanded', !isExpanded);
      
      if (targetContent) {
        targetContent.hidden = isExpanded;
      }
      
      // Icon drehen für visuelles Feedback
      this.classList.toggle('rotated', !isExpanded);
    });
  });
  
  // DIS-Anmeldung-Links korrigieren
  const disAnmeldungLinks = document.querySelectorAll('a[href*="#dis-anmeldung"]');
  disAnmeldungLinks.forEach(link => {
    if (link.getAttribute('href') === '#dis-anmeldung') {
      link.setAttribute('href', 'dis-anmeldung.html');
    }
  });
}

// Funktion zum Umschalten der leichten Sprache
function toggleEasyLanguage(enable) {
  const easyTextElements = document.querySelectorAll('.easy-text');
  const normalTextElements = document.querySelectorAll('.normal-text');
  
  easyTextElements.forEach(el => {
    el.hidden = !enable;
  });
  
  normalTextElements.forEach(el => {
    el.hidden = enable;
  });
}

// Tab-Funktionalität
function initTabs() {
  console.log('Initialisiere Tabs...');
  const tabButtons = document.querySelectorAll('.tab');
  
  if (tabButtons.length === 0) {
    console.warn('Keine Tab-Buttons gefunden');
    return;
  }
  
  console.log(`${tabButtons.length} Tab-Buttons gefunden`);
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log(`Tab ${this.id} wurde geklickt`);
      
      // Aktive Klasse von allen Tabs entfernen
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      // Aktive Klasse zum geklickten Tab hinzufügen
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
      // Alle Panels ausblenden
      const panels = document.querySelectorAll('.tab-panel');
      panels.forEach(panel => {
        panel.hidden = true;
        panel.classList.remove('active');
      });
      
      // Zugehöriges Panel einblenden
      const targetId = this.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.hidden = false;
        targetPanel.classList.add('active');
        console.log(`Panel ${targetId} wurde aktiviert`);
      } else {
        console.error(`Panel mit ID ${targetId} nicht gefunden`);
      }
    });
  });
}

// Accordion-Funktionalität
function initAccordion() {
  console.log('Initialisiere Akkordeons...');
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  if (accordionButtons.length === 0) {
    console.warn('Keine Akkordeon-Buttons gefunden');
    return;
  }
  
  console.log(`${accordionButtons.length} Akkordeon-Buttons gefunden`);
  
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log(`Akkordeon ${this.id} wurde geklickt`);
      
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const targetId = this.getAttribute('aria-controls');
      const targetContent = document.getElementById(targetId);
      
      this.setAttribute('aria-expanded', !isExpanded);
      
      if (targetContent) {
        targetContent.hidden = isExpanded;
        console.log(`Akkordeon-Panel ${targetId} ist jetzt ${isExpanded ? 'ausgeblendet' : 'sichtbar'}`);
      } else {
        console.error(`Akkordeon-Panel mit ID ${targetId} nicht gefunden`);
      }
    });
  });
}