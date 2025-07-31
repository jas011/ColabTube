"use client";
import { Button } from "@/components/ui/button";
import Gernal from "./general/general";
import Member from "./member/member";
import Storage from "./Store/store";
import { useEffect } from "react";
import Layout from "../file-space/Layout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const folderId = searchParams?.get("settings") || "gernal";
  const Route = (settingsUrl: string) => {
    if (settingsUrl != "gernal")
      router.push(`${pathname}?settings=${settingsUrl}`);
    else router.push(`${pathname}`);
  };
  useEffect(() => {
    if (!["gernal", "member", "storage"].includes(folderId)) {
      toast.error("Folder doesn't exist!", { duration: 3000 });
      Route("gernal");
    }
  }, [folderId]);

  const block = () => {
    switch (folderId) {
      case "gernal":
        return <Gernal />;
      case "member":
        return <Member />;
      case "storage":
        return <Storage />;
      default:
        return null;
    }
  };

  return (
    <Layout isFiles={false}>
      <section className="bg-[#fafafa] h-full">
        <div
          className="  border-b border-input "
          style={{ fontFamily: "GeistSans, GeistSans Fallback" }}
        >
          <h1
            style={{ textAlign: "justify" }}
            className="scroll-m-20 py-10 md:mx-auto mx-5 max-w-[1112px] text-center text-3xl font-medium tracking-tight text-balance"
          >
            Settings
          </h1>
        </div>
        <main className="max-w-[1112px] md:mx-auto mx-5 flex flex-col md:flex-row mt-10 pb-10 gap-5">
          <div className="flex flex-col w-full md:w-[240px]">
            <Button
              variant="secondary"
              onClick={() => Route("gernal")}
              className={`bg-transparent shadow-none justify-start p-5 md:px-[10px] md:py-[12px] hover:bg-[#ededed]  ${
                folderId == "gernal" ? "text-black" : "text-[#928e8e]"
              }`}
            >
              Gernal
            </Button>
            <Button
              onClick={() => Route("member")}
              variant="secondary"
              className={`bg-transparent shadow-none justify-start p-5 md:px-[10px] md:py-[12px] hover:bg-[#ededed]  ${
                folderId == "member" ? "text-black" : "text-[#928e8e]"
              }`}
            >
              Member
            </Button>
            <Button
              onClick={() => Route("storage")}
              variant="secondary"
              className={`bg-transparent shadow-none justify-start p-5 md:px-[10px] md:py-[12px] hover:bg-[#ededed]  ${
                folderId == "storage" ? "text-black" : "text-[#928e8e]"
              }`}
            >
              Storage
            </Button>
          </div>
          {block()}
        </main>
      </section>
    </Layout>
  );
}
