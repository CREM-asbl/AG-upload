import { css, html, LitElement } from 'lit';
import { setState } from './Core/App';
import './file-list';
import './Firebase/firebase-init';
import './header-elem';
import { findAllModules } from './Requests/moduleRequest';
import { findAllThemes } from './Requests/themeRequest';
import './sign-in';

class AguApp extends LitElement {
  constructor() {
    super();
  }

  static get styles() {
    return css`
    `
  }

  async firstUpdated() {
    let modules = await findAllModules();
    let themes = await findAllThemes();
    setState({ modules, themes });
  }

  render() {
    return [
      html`<header-elem></header-elem>
        <file-list></file-list>`
    ];
  }
}
customElements.define('agu-app', AguApp);
