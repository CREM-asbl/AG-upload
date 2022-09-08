import { css, html, LitElement } from 'lit';
import './Firebase/firebase-init';
import './sign-in';
import './header-elem';
import { createElem } from './Core/general';

class HeaderElem extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
    `
  }

  firstUpdated() {
  }

  render() {
    return [
      html`
        <div>
          <a @click="${() => createElem('sign-in')}">se connecter</a>
        </div>
      `
    ];
  }
}
customElements.define('header-elem', HeaderElem);
