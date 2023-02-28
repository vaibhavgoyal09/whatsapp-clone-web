import {
   getDownloadURL, ref, StorageReference, uploadBytes
} from "firebase/storage";
import { storage } from "../utils/FirebaseConfig";

class FirebaseService {
  getStorageRef(path?: string): StorageReference {
    return ref(storage, path);
  }

  async getMediaURL(ref: StorageReference): Promise<string> {
    return await getDownloadURL(ref);
  }

  async uploadFile(storageRef: StorageReference, file: File) {
    await uploadBytes(storageRef, file);
  }
}

export default FirebaseService;
