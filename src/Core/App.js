window.dev_mode = location.hostname === 'localhost';

/**
 * Classe principale de l'application
 */
export class App {
  constructor() {
    this.user = null;

    this.modules = [];
    this.themes = [];
  }
}

export const app = new App();

//Préparation à un state-changed plus général
//Ceci permettra aussi de réduire le nombre de listener par la suite
export const setState = (update) => {
  // modifie le pointeur de app, du coup marche pas
  // app = {...Object.entries(app), ...Object.entries(update)};
  for (const [key, value] of Object.entries(update)) {
    app[key] = value;
  }
  window.dispatchEvent(new CustomEvent('state-changed', { detail: app }));
  if ('modules' in update) {
    window.dispatchEvent(new CustomEvent('modules-changed', { detail: app }));
  }
  if ('themes' in update) {
    window.dispatchEvent(new CustomEvent('themes-changed', { detail: app }));
  }
};
