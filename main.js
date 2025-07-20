import initButtonAnimation from "./gsap-button/index.js";
import { GSAPButtonContent } from "./content.js";

window.onload = () => {
  // Initialize button animation
  initButtonAnimation();
  
  // Initialize tabs
  initTabs();
  
  // Load file contents
  loadFileContents();
};

function loadFileContents() {
  document.querySelector('#html code').textContent = GSAPButtonContent.htmlContent;
  document.querySelector('#css code').textContent = GSAPButtonContent.cssContent;
  document.querySelector('#javascript code').textContent= GSAPButtonContent.jsContent;
  hljs.highlightAll();
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button and corresponding panel
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}
