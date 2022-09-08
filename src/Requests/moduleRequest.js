import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { app } from "../Core/App";
import { handleMultipleDocumentRequest, handleSingleDocumentRequest } from "./generalRequest";

export async function findModuleByName(name) {
  let moduleInfo = handleSingleDocumentRequest(() => getDoc(doc(app.db, "modules", name)));
  return moduleInfo;
}

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
