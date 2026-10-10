console.log('ARISTA TEST: file loaded');

class AristaTest extends HTMLElement {
  connectedCallback() {
    console.log('ARISTA TEST: element connected');
    this.style.display = 'block';
    this.style.minHeight = '200px';
    this.style.padding = '24px';
    this.style.boxSizing = 'border-box';
    this.style.backgroundColor = '#0c0f33';
    this.style.color = '#f0c878';
    this.style.font = 'bold 24px Arial, sans-serif';
    this.textContent = 'ARISTA TEST OK';
  }
}

if (!customElements.get('arista-test')) {
  customElements.define('arista-test', AristaTest);
}
