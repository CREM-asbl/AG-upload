import { css, html, LitElement } from 'lit';
import { app } from './Core/App';
import { createElem } from './Core/general';
import './Firebase/firebase-init';
import './popups/addfile-popup';
import './popups/addmodule-popup';
import './popups/addtheme-popup';
import { findAllFiles } from './Requests/fileRequest';

class FileList extends LitElement {
  static get properties() {
    return {
      allModules: { type: Array },
      filesDisplayed: { type: Array },
      environmentToShow: { type: String },
      moduleToShow: { type: String },
      nameSorted: { type: String },
      clipboardText: { type: String },
    };
  }

  constructor() {
    super();

    this.allModules = [{ id: 'Tous les modules' }, ...app.modules];
    window.addEventListener('modules-changed', () => this.allModules = [{ id: 'Tous les modules' }, ...app.modules]);
    this.filesDisplayed = [];
    this.environmentToShow = 'All';
    this.moduleToShow = 'Tous les modules';

    this.nameSorted = 'notSorted';

    this.clipboardText = 'Copier le lien';
  }

  static get styles() {
    return css`
      table
      {
        border: 1px solid #333;
        border-spacing: 0px;
        overflow: scroll;
      }

      td, th {
        border-collapse:collapse;
        // border-right: solid 0.5px #333;
        // border-left: solid 0.5px #333;
        padding: 5px 20px;
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
        z-index: 1;
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
        // text-decoration: none;
        color: blue;
      }

      a:visited {
        // text-decoration: none;
        color: blue;
      }
    `
  }

  async handleDisplayFile(findFunction) {
    let filesInfos = await findFunction();

    if (!filesInfos)
      return;

    this.filesDisplayed = [...filesInfos];
  }

  firstUpdated() {
    this.handleDisplayFile(findAllFiles);
  }

  changeEnvironmentShown(event) {
    this.environmentToShow = event.target.options[event.target.selectedIndex].value;
  }

  changeModuleShown(event) {
    this.moduleToShow = event.target.options[event.target.selectedIndex].value;
  }

  copyToClipboard(event) {
    this.clipboardText = 'Lien copié !';
    navigator.clipboard.writeText(event.target.parentNode.parentNode.querySelector("a").href);
  }

  sortByName() {
    if (this.nameSorted != 'ascending') {
      this.nameSorted = 'ascending';
      this.filesDisplayed.sort((file1, file2) => {
        return file1.id.localeCompare(file2.id)
      });
    } else {
      this.nameSorted = 'descending';
      this.filesDisplayed.sort((file1, file2) => {
        return file2.id.localeCompare(file1.id)
      });
    }
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

  render() {
    console.log(this.filesDisplayed[0]?.module.id, this.moduleToShow)
    return [
      html`
        <button @click="${this.openAddThemePopup}">
          Ajouter un thème
        </button>
        <button @click="${this.openAddModulePopup}">
          Ajouter un module
        </button>
        <button @click="${this.openAddFilePopup}">
          Ajouter un fichier
        </button>
        Filtrer par
        <form onsubmit="event.preventDefault();">
          <select name="environmentToShow" id="environmentToShow" @change="${this.changeEnvironmentShown}">
            <option value="All">Tous les environnements</option>
            <option value="Grandeurs">Grandeurs</option>
            <option value="Tangram">Tangram</option>
            <option value="Cubes">Cubes</option>
            <option value="Geometrie">Géométrie</option>
          </select>

          <select @change="${this.changeModuleShown}">
            ${this.allModules.map(module => html`<option value="${module.id}">${module.id}</option>`)}
          </select>

          <!-- <input type="submit" value="Afficher les fichiers"
            onclick="\${this.handleDisplayFile}"
          /> -->
        </form>
        <table>
          <thead>
            <tr style="background-color: #bbb">
              <th
                @click="${this.sortByName}"
                id="title" class="noselect sortable" sorted="${this.nameSorted}">
                Nom du fichier
              </th>
              <th>
                Lien
              </th>
              <th>
                Environnement
              </th>
              <!-- <th>
                Emplacement
              </th> -->
              <th>
                Module
              </th>
              <th>
                Modifier
              </th>
              <th>
                Supprimer
              </th>
            </tr>
          </thead>
          <tbody>
            ${this.filesDisplayed
              .filter(fileDisplayed => this.environmentToShow == 'All' || fileDisplayed.environment == this.environmentToShow)
              .filter(fileDisplayed => this.moduleToShow == 'Tous les modules' || fileDisplayed.module.id == this.moduleToShow)
              .map((fileDisplayed, idx) => html`
              <tr style="background-color: ${idx % 2 ? '#ddd' : '#fff'}">
                <td>
                  ${fileDisplayed.id}
                </td>
                <td>
                  <a target="_blank" href="${'https://ag.crem.be/?activityName=' + fileDisplayed.id}">
                    ${'ag.crem.be/?activityName=' + fileDisplayed.id}
                  </a>
                  <div class="clipboardContainer">
                    <span class="clipboardTooltip">${this.clipboardText}</span>
                    <img style="height: 1em; float: right;" src="images/copyToClipboard.png" @click="${this.copyToClipboard}" @mouseout="${() => this.clipboardText = 'Copier le lien'}" />
                  </div>
                </td>
                <td>
                  ${fileDisplayed.environment}
                </td>
                <td>
                  ${fileDisplayed.module.id}
                </td>
                <td>
                  <img style="height: 1em;" src='images/modify.png' />
                </td>
                <td>
                  <img style="height: 1em;" src='images/delete.png' />
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      `
    ];
  }
}
customElements.define('file-list', FileList);
