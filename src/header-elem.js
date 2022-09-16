import { css, html, LitElement } from 'lit';
import { createElem } from './Core/general';
import './Firebase/firebase-init';
import './header-elem';
import './sign-in';

class HeaderElem extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
      div {
          height: 10%;
      }
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
