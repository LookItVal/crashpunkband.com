import Image from "next/image";

export default function Home() {
  return (
    <main 
      className="h-[100svh] flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/crash_replay.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/crash_banner.png"
          alt="CRASH"
          width={384}
          height={128}
          className="w-64 md:w-96"
        />
        <h1 className="text-white text-4xl font-extrabold tracking-wider uppercase">Coming Soon.</h1>
      </div>
    </main>
  );
}
