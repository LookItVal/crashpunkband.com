import Image from "next/image";
import FallingCanvas from "@/components/FallingCanvas/FallingCanvas";


export default function Home() {
  return (
    <main 
      className="h-svh w-svw flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/crash_replay.jpg')" }}
    >
      <FallingCanvas
        className="h-full w-full"  
      >
        <div className="relative z-10 flex flex-col h-full w-full justify-center items-center">
          <div className="flex flex-row">
            <Image
              src="/C.png"
              alt="C"
              width={43}
              height={128}
              className="world-item pointer-events-none select-none"
            />
            <Image
              src="/R.png"
              alt="R"
              width={52}
              height={128}
              className="world-item pointer-events-none select-none"
            />
            <Image
              src="/A.png"
              alt="A"
              width={145}
              height={128}
              className="world-item pointer-events-none select-none"
            />
            <Image
              src="/S.png"
              alt="S"
              width={32}
              height={128}
              className="world-item pointer-events-none select-none"
            />
            <Image
              src="/H.png"
              alt="H"
              width={56}
              height={128}
              className="world-item pointer-events-none select-none"
            />
          </div>
          <h1 className="text-white text-4xl font-extrabold tracking-wider uppercase">Coming Soon.</h1>
          <p className="text-white text-lg mt-4 max-w-xl text-center px-4">
            * Everything is still very much in development, so be careful not to break anything, and whatever you do: DON&apos;T CLICK ANYWHERE.
          </p>
        </div>
      </FallingCanvas>
      <div className="absolute top-0 left-0 w-screen h-screen opacity-60 bg-black z-0"></div>
    </main>
  );
}