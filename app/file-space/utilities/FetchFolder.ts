import { useFolder } from "../context/context";
export function FetchFolder(folderAddress: string) {
  const folderContext = useFolder();
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { folderMap } = folderContext;
  return folderMap.get(folderAddress);
}
