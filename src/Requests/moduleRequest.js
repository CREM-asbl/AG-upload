import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { app, setState } from "../Core/App";
import { handleMultipleDocumentRequest } from "./generalRequest";

export async function findAllModules() {
  let modulesInfos = await handleMultipleDocumentRequest(() => getDocs(collection(app.db, "modules")));
  return modulesInfos;
}

export function addModule(moduleName, themeName) {
  let newModuleDocRef = doc(app.db, 'modules', moduleName);
  let themeDocRef = doc(app.db, 'themes', themeName);

  setDoc(newModuleDocRef, {
    theme: themeDocRef,
    files: [],
    hidden: false,
  });

  updateDoc(themeDocRef, {
    modules: arrayUnion(newModuleDocRef),
  });
}

export async function updateModules() {
  let modules = await findAllModules();
  setState({ modules });
}
