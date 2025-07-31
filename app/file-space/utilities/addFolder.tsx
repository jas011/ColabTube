import { useFolder } from "../context/context";

export function UpdateFolder(foldername: string) {
  const folderContext = useFolder();
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { folderMap, current } = folderContext;
  const folder = folderMap.get(current);
  folder.addFolder(foldername);
}
