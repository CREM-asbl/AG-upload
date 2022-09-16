import { ref, uploadBytes } from 'firebase/storage';
import { css, html, LitElement } from 'lit';
import { app } from '../Core/App';
import { addFile, updateFiles } from '../Requests/fileRequest';
import { updateModules } from '../Requests/moduleRequest';
import { TemplatePopup } from './template-popup';

class AddFilePopup extends LitElement {
  static get properties() {
    return {
      allModules: { type: Array },
    };
  }

  constructor() {
    super();


    this.allModules = app.modules;
    window.addEventListener('modules-changed', () => this.allModules = app.modules)

    window.addEventListener('close-popup', () => this.close());
  }

  static get styles() {
    return [
      TemplatePopup.template_popup_styles(),
      css`
        input[type=file] {
          margin: auto;
        }
      `,
    ];
  }

  updated() {
  }

  changeModuleSelected(e) {
    this.moduleName = e.target.value;
  }

  changeFileSelected(e) {
    this.filesSelected = e.target.files;
  }

  render() {
    return html`
      <template-popup>
        <h2 slot="title">Ajouter un fichier</h2>
        <div id="" slot="body">

          <label for="file">Fichier</label>
          <input @change="${this.changeFileSelected}" multiple id="file" type="file" name="file"/>

          <label for="module">Module</label>
          <select @change="${this.changeModuleSelected}" id="module" name="module">
            ${this.allModules.map(module => html`<option value="${module.id}">${module.id}</option>`)}
          </select>

        </div>
        <div slot="footer">
          <button id="focus" @click="${() => this.sendFile()}">Envoyer</button>
        </div>
      </template-popup>
    `;
  }

  async sendFile() {
    [...this.filesSelected].forEach(async file => {
      let filename = file.name;
      let fileContent = await file.text();
      let fileContentObject = JSON.parse(fileContent);

      const storageRef = ref(app.storage, filename);
      await uploadBytes(storageRef, file);

      addFile(filename, this.moduleName, fileContentObject);
      updateModules();
      updateFiles();
    })

    this.close();
  }

  close() {
    this.remove();
  }
}
customElements.define('addfile-popup', AddFilePopup);
