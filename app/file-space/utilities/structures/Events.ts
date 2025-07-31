type OperationType = "move" | "rename" | "upload" | "copy" | "delete";
type type = "file" | "folder";
export interface EventInput {
  op: OperationType;
  fileID: string;
  fileLoc: string;
  type: type;
  newFileID?: string;
  from?: string;
  to?: string;
  fileName: string;
}

export class Operation {
  timestamp: Date;
  op: OperationType;
  type: type; //holder or file
  fileID: string;
  fileLoc: string;
  fileName: string;
  from?: string;
  to?: string;
  newFileID?: string;

  constructor(ev: EventInput) {
    this.timestamp = new Date();
    this.op = ev.op;
    this.fileID = ev.fileID;
    this.fileLoc = ev.fileLoc;
    this.fileName = ev.fileName;
    this.type = ev.type;

    if (ev.op === "copy" && ev.newFileID) {
      this.newFileID = ev.newFileID;
    }

    if (ev.from && ev.to) {
      this.from = ev.from;
      this.to = ev.to;
    }
  }
}

export interface BaseOp {
  timestamp: Date;
  operation: OperationType;
}

export interface DeleteOp extends BaseOp {
  Delfrom: string;
}

export interface CopyOp extends BaseOp {
  copiedFrom: string;
  copiedTo: string;
  newFileId: string;
}

export interface MoveOp extends BaseOp {
  prevPath: string;
  newPath: string;
}

export interface RenameOp extends BaseOp {
  prevName: string;
  newName: string;
}
export interface metadata {
  _id: string; // UUID
  teamID: string;
  name: string;
  type?: type;
  createdAt: Date;
  updatedAt: Date;
}
export interface file extends metadata {
  awsKey: string; // Actual S3/Wasabi key
  thumbnailKey: string;
  uploaderID: string;
  mimeType: string;
  size: number; // Optional: in bytes
  previewKey: string;
}
export interface folder extends metadata {
  location: string; // Full path
  parentID: string;
  parentLocation: string;
  content: {
    folders: string[]; // Child folder IDs
    files: string[]; // Child file IDs
  };
}
export type UploadOp = file | folder;

export type ComposableEvent = CopyOp | MoveOp | RenameOp | BaseOp | DeleteOp;

export type event = MoveOp | RenameOp | CopyOp | Date | BaseOp | DeleteOp;

// 🧠 Class to compose multiple raw events into a summarized one
export class ComposedEvent {
  _id: string;
  fileLoc: string;
  type: type;
  fileName: string;
  event: {
    move?: MoveOp;
    rename?: RenameOp;
    copy?: CopyOp;
    delete?: DeleteOp;
    timestamp: Date;
  };

  constructor(ev: {
    fileID: string;
    fileLoc: string;
    type: type;
    fileName: string;
  }) {
    this._id = ev.fileID;
    this.fileLoc = ev.fileLoc;
    this.type = ev.type;
    this.fileName = ev.fileName;
    this.event = {
      timestamp: new Date(),
    };
  }

  addEvent(event: ComposableEvent) {
    // this.event.operation.push(event.operation[0]);
    console.log("eVENT:,", event);
    switch (event.operation) {
      case "copy":
        if (
          "copiedFrom" in event &&
          "copiedTo" in event &&
          "newFileId" in event
        ) {
          if (!this.event.copy) {
            this.event.copy = {
              operation: "copy",
              copiedFrom: "",
              copiedTo: "",
              newFileId: "",
              timestamp: event.timestamp,
            };
          }
          (this.event.copy as CopyOp).copiedFrom = event.copiedFrom;
          (this.event.copy as CopyOp).copiedTo = event.copiedTo;
          (this.event.copy as CopyOp).newFileId = event.newFileId;
        }
        break;

      case "move":
        if ("prevPath" in event && "newPath" in event) {
          if (!this.event.move) {
            this.event.move = {
              operation: "move",
              prevPath: "",
              newPath: "",
              timestamp: event.timestamp,
            };
          }
          (this.event.move as MoveOp).prevPath = event.prevPath;
          (this.event.move as MoveOp).newPath = event.newPath;
        }
        break;

      case "rename":
        if ("prevName" in event && "newName" in event) {
          if (!this.event.rename) {
            this.event.rename = {
              operation: "rename",
              prevName: "",
              newName: "",
              timestamp: event.timestamp,
            };
          }
          const prev = (this.event as RenameOp).prevName || event.prevName;
          (this.event.rename as RenameOp).prevName = prev;
          (this.event.rename as RenameOp).newName = event.newName;
        }
        break;

      case "delete":
        {
          if ("Delfrom" in event) {
            if (!this.event.delete) {
              this.event.delete = {
                operation: "delete",
                timestamp: event.timestamp,
                Delfrom: "",
              };
            }
            (this.event.delete as DeleteOp).Delfrom = event.Delfrom;
          }
        }
        break;
    }

    this.event.timestamp = event.timestamp; // update to most recent
  }
}

export class EventLog {
  private events: Operation[];
  private fileMapIndex: Map<string, number[]>;
  timer: NodeJS.Timeout | null;
  constructor(
    private onCompose?: (events: Record<string, ComposedEvent>) => void
  ) {
    this.events = [];
    this.fileMapIndex = new Map();
    this.timer = null;
    this.addEvent = this.addEvent.bind(this); // 👈 bind here
  }

  private maybeScheduleCompose() {
    if (this.events.length >= 10) {
      if (this.timer != null) {
        clearTimeout(this.timer);
      }
      this.composeEvents();
    } else {
      this.timer = setTimeout(() => {
        this.composeEvents();
        this.timer = null; // reset after running
      }, 1000);
    }
  }
  flush(): Record<string, ComposedEvent> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    return this.composeEvents();
  }

  debugPrint() {
    console.log("Pending Events:");
    this.events.forEach((e) => console.log(e));
    console.log("Index Map:", this.fileMapIndex);
  }

  addEvent(event: Operation) {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    const index = this.events.length; // Correct index before push
    let flag = true;

    if (event.op == "rename") {
      if (event.from == event.to) {
        return;
      }
      if (this.fileMapIndex.has(event.fileID)) {
        const index = this.fileMapIndex.get(event.fileID);
        if (index)
          for (const i of index) {
            if (this.events[i].op == "rename") {
              this.events[i] = event;
              break;
            }
          }
      } else {
        this.fileMapIndex.set(event.fileID, []);
        this.events.push(event);
        this.fileMapIndex.get(event.fileID)!.push(index); // Non-null assertion
      }
      flag = false;
    }

    if (flag) {
      this.events.push(event);

      const ids = [event.fileID];
      if (event.newFileID) {
        ids.push(event.newFileID);
        const copiedEvent = new Operation({
          ...event,
          from: event.fileName,
          to: event.fileName,
          fileLoc: event?.to || "",
          op: "rename",
          fileID: event.newFileID!,
        });
        delete copiedEvent.newFileID;
        this.events.push(copiedEvent);
      } // Track newFileID too (e.g., copy)

      for (const [i, id] of ids.entries()) {
        if (!this.fileMapIndex.has(id)) {
          this.fileMapIndex.set(id, []);
        }

        this.fileMapIndex.get(id)!.push(index + i); // Non-null assertion
      }
    }
    this.maybeScheduleCompose();
  }

  getAllEvents(): Operation[] {
    return this.events;
  }

  getEventsByFile(fileID: string): Operation[] {
    const indexes = this.fileMapIndex.get(fileID) || [];
    return indexes.map((i) => this.events[i]);
  }

  // For debugging / inspection
  printIndexMap() {
    console.log("File Map Index:", this.fileMapIndex);
  }

  composeEvents(): Record<string, ComposedEvent> {
    const composedMap: Record<string, ComposedEvent> = {};

    for (const [fileID, indexes] of this.fileMapIndex.entries()) {
      const composedEvent = new ComposedEvent({
        fileID,
        fileLoc: this.events[indexes[0]].fileLoc,
        type: this.events[indexes[0]].type,
        fileName: this.events[indexes[0]].fileName,
      });

      for (const index of indexes) {
        const event = this.events[index];
        console.log("eVENT:,", event);
        switch (event.op) {
          case "copy":
            composedEvent.addEvent({
              timestamp: event.timestamp,
              operation: event.op,
              copiedFrom: event.from,
              copiedTo: event.to,
              newFileId: event.newFileID,
            });
            break;

          case "move":
            composedEvent.addEvent({
              timestamp: event.timestamp,
              operation: event.op,
              prevPath: event.from,
              newPath: event.to,
            });
            break;

          case "rename":
            composedEvent.addEvent({
              timestamp: event.timestamp,
              operation: event.op,
              prevName: event.from,
              newName: event.to,
            });
            break;

          case "delete":
            composedEvent.addEvent({
              timestamp: event.timestamp,
              operation: event.op,
              Delfrom: event.from,
            });
            break;
        }
      }

      composedMap[fileID] = composedEvent;
    }

    // 🪝 Trigger the hook if provided
    this.onCompose?.(composedMap);
    this.fileMapIndex = new Map(); //cleaning for new events
    this.events = []; //cleaning for new events
    return composedMap;
  }
}
