import * as React from "react";

interface dataLib {
  Avtar: File | undefined;
  setAvtar: React.Dispatch<React.SetStateAction<File | undefined>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  dob: Date | undefined;
  setDob: React.Dispatch<React.SetStateAction<Date | undefined>>;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  Proffesion: string;
  setProfession: React.Dispatch<React.SetStateAction<string>>;
  intrrest: string[];
  setIntrrest: React.Dispatch<React.SetStateAction<string[]>>;
  workspace: string;
  setWorkspace: React.Dispatch<React.SetStateAction<string>>;
}
export const dataContext = React.createContext<dataLib | undefined>(undefined);

export function Context({ children }: { children: React.ReactNode }) {
  const [Avtar, setAvtar] = React.useState<File>();
  const [name, setName] = React.useState<string>("");
  const [dob, setDob] = React.useState<Date | undefined>(undefined);
  const [user, setUser] = React.useState<string>("");
  const [Proffesion, setProfession] = React.useState<string>("");
  const [workspace, setWorkspace] = React.useState<string>("");
  const [intrrest, setIntrrest] = React.useState<string[]>([]);
  // const data = React.useContext(userInfo);
  // if (!data) {
  //   // Handle the error or return fallback UI
  //   console.error("Folder context is undefined");
  //   return null;
  // }
  // const { email, setEmail } = data;
  // console.log(email);

  return (
    <dataContext.Provider
      value={{
        Avtar,
        setAvtar,
        name,
        setName,
        dob,
        setDob,
        user,
        setUser,
        Proffesion,
        setProfession,
        intrrest,
        setIntrrest,
        workspace,
        setWorkspace,
      }}
    >
      {children}
    </dataContext.Provider>
  );
}
