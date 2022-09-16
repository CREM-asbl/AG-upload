import { arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { app, setState } from "../Core/App";
import { handleMultipleDocumentRequest } from "./generalRequest";

export async function findAllFiles() {
  let filesInfos = await handleMultipleDocumentRequest(() => getDocs(collection(app.db, "files")));
  return filesInfos;
}

export function addFile(file, moduleName, fileContentObject) {
  let newFileDocRef = doc(app.db, 'files', file);
  let moduleDocRef = doc(app.db, 'modules', moduleName);

  setDoc(newFileDocRef, {
    module: moduleDocRef,
    version: fileContentObject.appVersion,
    environment: fileContentObject.envName,
  });

  updateDoc(moduleDocRef, {
    files: arrayUnion(newFileDocRef),
  });
}

export async function updateFiles() {
  let files = await findAllFiles();
  setState({ files });
}
