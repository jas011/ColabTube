import { nanoid } from "nanoid";
type folderContents = {
  files: { [key: string]: File };
  folders: Folder[];
};

// class File {
//   type = "file";
//   name: string;
//   address: string;
//   id: string;
//   key: string = nanoid(7);
//   modified: Date = new Date();
//   created: Date = new Date();
//   constructor(name: string, address: string) {
//     this.name = name;
//     this.address = address;
//     this.id = nanoid(7);
//   }
//   rename(name: string) {
//     this.name = name;
//   }
// }

export class FileMetadata {
  id: string;
  teamID: string;
  name: string;
  type = "file";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(name: string, teamID: string, _id?: string) {
    this.id = _id ?? nanoid(12); // longer ID for uniqueness
    this.name = name;
    this.teamID = teamID;
  }

  rename(newName: string) {
    this.name = newName;
    this.updatedAt = new Date();
  }
}

class File extends FileMetadata {
  awsKey: string;
  thumbnailKey: string;
  uploaderID: string;
  mimeType: string;
  size: number;
  previewKey: string;
  address: string;
  constructor(
    {
      name,
      teamID,
      uploaderID,
      awsKey,
      thumbnailKey,
      previewKey,
      mimeType,
      size,
      _id,
    }: {
      name: string;
      teamID: string;
      uploaderID: string;
      awsKey: string;
      thumbnailKey: string;
      previewKey: string;
      mimeType: string;
      size: number;
      _id?: string;
    },
    address: string,
    op?: string
  ) {
    if (op == null) {
      super(name, teamID, _id);
    } else super(name, teamID);
    this.awsKey = awsKey;
    this.thumbnailKey = thumbnailKey;
    this.previewKey = previewKey;
    this.uploaderID = uploaderID;
    this.mimeType = mimeType;
    this.size = size;
    this.address = address;
  }
}

export default class Folder {
  type = "folder";
  name: string;
  key: string;
  address: string = "root";
  createdAt: Date;
  updatedAt: Date;
  contents: folderContents = { files: {}, folders: [] };

  constructor(name: string, key?: string, createdAt?: Date, updatedAt?: Date) {
    this.name = name;
    this.key = key || nanoid(7);
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
  addFile(file: File, op?: string, { flag = true }: { flag?: boolean } = {}) {
    file.address = this.address + "/" + file.id;
    this.contents.files[file.id] = file;

    if (flag) {
      const name = file.name.split(".");
      const filename = `${file.id}.${name[name.length - 1]}`;
      const finalKey = `Cloud/${filename}`;
      file.awsKey = finalKey;
    }
    if (op != null) {
      file.id = nanoid(12);
    }
    return file;
  }
  addFolder(folder: Folder) {
    if (
      this.contents.folders.map((folder) => folder.name).includes(folder.name)
    ) {
      console.log("Folder already exists");
      return false; //Folder already exists
    } else {
      folder.address = this.address + "/" + folder.key;
      this.contents.folders.push(folder);
      console.log("Folder created successfully");
      return folder; //Folder created successfully
    }
  }
  removeFile(file: File) {
    delete this.contents.files[file.id];
  }
  removeFolder(key: string) {
    this.contents.folders = this.contents.folders.filter((f) => f.key !== key);
  }
  length() {
    return (
      this.contents.folders.length + Object.keys(this.contents.files).length
    );
  }
  rename(name: string) {
    this.name = name;
  }
}

export { Folder, File };
