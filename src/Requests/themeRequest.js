import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { app } from "../Core/App";
import { handleMultipleDocumentRequest } from "./generalRequest";

export function addTheme(themeName) {
  setDoc(doc(app.db, "themes", themeName), {
    modules: []
  });
}

export async function findAllThemes() {
  let themesInfos = await handleMultipleDocumentRequest(() => getDocs(collection(app.db, "themes")));
  return themesInfos;
}
