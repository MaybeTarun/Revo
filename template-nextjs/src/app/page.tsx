import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-black w-screen h-screen flex flex-col justify-center items-center select-none">
      <div className="flex flex-col items-center space-y-2">
        <Image 
          src="/revo.png" 
          alt="Revo" 
          width={160}
          height={160}
          className="w-32 h-32 md:w-40 md:h-40 transition-transform duration-300 hover:scale-105"
          priority
        />
        <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wider">
          Revo
        </h1>
        <p className="text-gray-400 text-lg md:text-xl text-center max-w-md">
          Your project is ready to go
        </p>
      </div>
    </div>
  );
}
