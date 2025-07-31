import { nanoid } from "nanoid";
type folderContents = {
  files: { [key: string]: File };
  folders: folder[];
};

class File {
  name: string;
  address: string;
  id: string;
  key: string = nanoid(7);
  modified: Date = new Date();
  created: Date = new Date();
  size?: number;
  constructor(name: string, address: string, size?: number) {
    this.name = name;
    this.address = address;
    this.id = nanoid(7);
    if (size) this.size = size;
  }
  rename(name: string) {
    this.name = name;
  }
}
// type files = {
//     name: string;
//     size: number;//in kb
//     address: string;
//     key: string;
//     modified: Date;
//     created: Date;
//     id: string;
// }
// type folders = {
//     name: string;
//     address: string;
//     contents:folderContents;
// }

class folder {
  name: string;
  address: string = "root";
  contents: folderContents = { files: {}, folders: [] };
  constructor(name: string) {
    this.name = name;
  }
  addFile(file: File) {
    file.address = this.address + "/" + file.name;
    this.contents.files[file.id] = file;
  }
  addFolder(folder: folder) {
    if (
      this.contents.folders.map((folder) => folder.name).includes(folder.name)
    ) {
      console.log("Folder already exists");
      return false; //Folder already exists
    } else {
      folder.address = this.address + "/" + folder.name;
      this.contents.folders.push(folder);
      console.log("Folder created successfully");
      return true; //Folder created successfully
    }
  }
  removeFile(file: File) {
    delete this.contents.files[file.id];
  }
  removeFolder(folderName: string) {
    this.contents.folders = this.contents.folders.filter(
      (f) => f.name !== folderName
    );
  }
  rename(file: File, name: string) {
    this.contents.files[file.id].name = name;
  }
  length() {
    return (
      this.contents.folders.length + Object.keys(this.contents.files).length
    );
  }
}

export { folder, File };
