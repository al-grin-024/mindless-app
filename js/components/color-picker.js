/**
 * Mindless — <color-picker> Web Component
 * Grid of color swatches sourced from getAllColors().
 * Selected swatch shows a dark border + checkmark SVG overlay.
 *
 * Dispatches: 'color-change' CustomEvent with { hex, name } detail.
 */
import { getAllColors } from '../data/categories.js';

class ColorPicker extends HTMLElement {
  constructor() {
    super();
    this._selected = null;
    this._swatches = [];
  }

  static get observedAttributes() {
    return ['value'];
  }

  connectedCallback() {
    this._selected = this.getAttribute('value') || null;
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'value' && oldVal !== newVal) {
      this._selected = newVal;
      this._updateSelection();
    }
  }

  _render() {
    const colors = getAllColors();

    // Grid container
    this.style.display = 'grid';
    this.style.gridTemplateColumns = 'repeat(auto-fill, 48px)';
    this.style.gap = '12px';
    this.style.justifyContent = 'center';

    this.innerHTML = '';
    this._swatches = [];

    colors.forEach(color => {
      const swatch = document.createElement('button');
      swatch.classList.add('rounded-full');
      swatch.setAttribute('aria-label', color.name);
      swatch.setAttribute('type', 'button');

      // Swatch base styles (dynamic color needs inline)
      swatch.style.width = '48px';
      swatch.style.height = '48px';
      swatch.style.backgroundColor = color.hex;
      swatch.style.border = '3px solid transparent';
      swatch.style.cursor = 'pointer';
      swatch.style.position = 'relative';
      swatch.style.display = 'flex';
      swatch.style.alignItems = 'center';
      swatch.style.justifyContent = 'center';
      swatch.style.transition = 'border-color 0.15s ease, transform 0.15s ease';
      swatch.style.padding = '0';

      // Apply selected state if matching
      if (this._selected && this._selected === color.hex) {
        this._applySelected(swatch);
      }

      swatch.addEventListener('click', () => {
        this._selected = color.hex;
        this.setAttribute('value', color.hex);
        this._updateSelection();
        this.dispatchEvent(new CustomEvent('color-change', {
          bubbles: true,
          detail: { hex: color.hex, name: color.name }
        }));
      });

      this._swatches.push({ el: swatch, hex: color.hex });
      this.appendChild(swatch);
    });
  }

  _updateSelection() {
    this._swatches.forEach(({ el, hex }) => {
      if (hex === this._selected) {
        this._applySelected(el);
      } else {
        this._clearSelected(el);
      }
    });
  }

  _applySelected(swatch) {
    swatch.style.borderColor = 'var(--text, #1A1A1A)';
    swatch.style.transform = 'scale(1.1)';

    // Add checkmark if not already present
    if (!swatch.querySelector('.color-picker-check')) {
      const check = document.createElement('span');
      check.classList.add('color-picker-check');
      check.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      check.style.position = 'absolute';
      check.style.display = 'flex';
      check.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))';
      swatch.appendChild(check);
    }
  }

  _clearSelected(swatch) {
    swatch.style.borderColor = 'transparent';
    swatch.style.transform = 'scale(1)';

    const check = swatch.querySelector('.color-picker-check');
    if (check) check.remove();
  }
}

customElements.define('color-picker', ColorPicker);
