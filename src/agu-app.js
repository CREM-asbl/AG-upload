import { css, html, LitElement } from 'lit';
import { app, setState } from './Core/App';
import { createElem } from './Core/general';
import './file-list';
import './Firebase/firebase-init';
import './header-elem';
import './popups/addfile-popup';
import './popups/addmodule-popup';
import './popups/addtheme-popup';
import { findAllModules, updateModules } from './Requests/moduleRequest';
import { findAllThemes, updateThemes } from './Requests/themeRequest';
import './sign-in';
import './theme-list';

class AguApp extends LitElement {
  static get properties() {
    return {
      allModules: { type: Array },
      elementTypeToShow: { type: String },
    };
  }

  constructor() {
    super();

    this.allModules = [{ id: 'Tous les modules' }, ...app.modules];
    window.addEventListener('modules-changed', () => this.allModules = [{ id: 'Tous les modules' }, ...app.modules]);

    this.allEnvironments = ['Tous les environnements', 'Grandeurs', 'Tangram', 'Cubes', 'Geometrie'];

    this.elementTypeToShow = null;
  }

  static get styles() {
    return css`
      .not-table-elements {
        height: 150px;
        width: 1400px;
        max-width: 90%;
        margin: auto;
      }

      .element-choice-container {
        display: flex;
      }

      .element-choice {
        width: 33.3333%;
        border: none;
        border-radius: 5px;
        box-shadow: 0px 0px 2px grey;
      }

      legend {
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.5);
      }

      .element-choice-selected {
        background-color: #e9e9e9;
        box-shadow: inset 0px 0px 3px grey;
      }

      #table-container {
        height: calc(100% - 150px);
        overflow: auto;
        margin: auto;
        // margin-top: 10px;
      }

      table
      {
        border-collapse: collapse;
        // border: 1px solid #333;
        margin: auto;
        // margin-top: 10px;
        // margin-bottom: 10px;
        border-spacing: 0px;
        width: 1400px;
        max-width: 90%;
        box-shadow: 0px 0px 5px grey;
        // border-radius:  7px;
      }

      thead {
        position: sticky;
        top: 0px;
        z-index: 10;
      }

      td, th {
        border-collapse:collapse;
        // border-right: solid 0.5px #333;
        // border-left: solid 0.5px #333;
        padding: 5px 20px;
      }

      tr {
        background-color: #bbb;
      }

      img.table-item-image {
        height: 1em;
      }

      [sorted="notSorted"] {
        background:url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIUnC2nKLnT4or00PvyrQwrPzUZshQAOw==) no-repeat center right !important;
      }

      [sorted="ascending"] {
        background:url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIRnC2nKLnT4or00Puy3rx7VQAAOw==) no-repeat center right !important;
      }

      [sorted="descending"] {
        background:url(data:image/gif;base64,R0lGODlhCwALAJEAAAAAAP///xUVFf///yH5BAEAAAMALAAAAAALAAsAAAIPnI+py+0/hJzz0IruwjsVADs=) no-repeat center right !important;
      }

      .clipboardContainer {
        float: right;
        position: relative;
        display: inline-block;
      }

      .clipboardContainer .clipboardTooltip {
        visibility: hidden;
        width: 140px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 11;
        bottom: 150%;
        left: 50%;
        margin-left: -75px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .clipboardContainer .clipboardTooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
      }

      .clipboardContainer:hover .clipboardTooltip {
        visibility: visible;
        opacity: 1;
      }

      a {
        color: blue;
      }

      a:visited {
        color: blue;
      }
    `
  }

  changeEnvironmentShown(event) {
    setState({ fileEnvironmentToShow: event.target.options[event.target.selectedIndex].value });
  }

  changeModuleShown(event) {
    setState({ fileModuleToShow: event.target.options[event.target.selectedIndex].value });
  }

  async firstUpdated() {
    updateThemes();
    updateModules();
  }

  changeElementTypeToShow(e) {
    this.elementTypeToShow = e.target.value;
  }

  openAddFilePopup() {
    createElem('addfile-popup');
  }

  openAddModulePopup() {
    createElem('addmodule-popup');
  }

  openAddThemePopup() {
    createElem('addtheme-popup');
  }

  showElement() {
    switch (this.elementTypeToShow) {
      case 'themes':
        return html`<theme-list></theme-list>`;
      case 'modules':
        return html`<module-list></module-list>`;
      case 'files':
        return html`<file-list></file-list>`;
      default:
        return html``;
    }
  }

  render() {
    return [
      html`
        <div class="not-table-elements">
          <a @click="${() => createElem('sign-in')}">se connecter</a>

          <div class="element-choice-container">
            <fieldset class="element-choice ${this.elementTypeToShow == 'themes' ? 'element-choice-selected' : ''}">
              <legend>Thèmes</legend>
              <input type="radio" name="elementTypeToShow" id="themes" value="themes" @change="${this.changeElementTypeToShow}">
              <label for="themes">Afficher les thèmes</label>
              <button @click="${this.openAddThemePopup}">
                Ajouter un thème
              </button>
            </fieldset>
            <fieldset class="element-choice ${this.elementTypeToShow == 'modules' ? 'element-choice-selected' : ''}">
              <legend>Modules</legend>
              <input type="radio" name="elementTypeToShow" id="modules" value="modules" @change="${this.changeElementTypeToShow}">
              <label for="modules">Afficher les modules</label>
              <button @click="${this.openAddModulePopup}">
                Ajouter un module
              </button>
            </fieldset>
            <fieldset class="element-choice ${this.elementTypeToShow == 'files' ? 'element-choice-selected' : ''}">
              <legend>Fichiers</legend>
              <input type="radio" name="elementTypeToShow" id="files" value="files" @change="${this.changeElementTypeToShow}">
              <label for="files">Afficher les fichiers</label>
              <button @click="${this.openAddFilePopup}">
                Ajouter un fichier
              </button>

              <br>

              Filtrer par

              <br>

              <select style="width:49%" name="environmentToShow" id="environmentToShow" @change="${this.changeEnvironmentShown}">
                ${this.allEnvironments.map(environment => html`<option value="${environment}">${environment}</option>`)}
              </select>

              <select style="width: 49%; float: right;" @change="${this.changeModuleShown}">
                ${this.allModules.map(module => html`<option value="${module.id}">${module.id}</option>`)}
              </select>
            </fieldset>
          </div>
        </div>
      `,
      this.showElement()
    ];
  }
}
customElements.define('agu-app', AguApp);
