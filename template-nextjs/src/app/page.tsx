import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-[#EFF0EF] w-screen h-screen flex flex-col justify-center items-center select-none">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center items-center space-x-4">
          <Image 
            src="/revo.svg" 
            alt="revo" 
            width={128}
            height={128}
            className="w-32 h-32 md:w-32 md:h-32"
            priority
          />
          <h1 className="text-[#2D2A32] text-6xl md:text-[10rem] font-semibold leading-none -mt-10">
            revo
          </h1>
        </div>
        <p className="text-[#2D2A32] text-base md:text-lg uppercase text-center max-w-md">
          your project is ready to go
        </p>
      </div>
    </div>
  );
}
