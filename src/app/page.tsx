import Login from "@components/Login";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Login />
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
