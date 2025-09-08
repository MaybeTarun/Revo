import { Revo } from 'revoicons';

export default function Home() {
  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <div className="h-[10vh] w-full border-b border-gray-400">
        <div className="h-full w-full md:w-[70vw] mx-auto border-x border-gray-400" />
      </div>
      <div className="h-full w-full md:w-[70vw] mx-auto border-x border-gray-400 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 -z-0 bg-[linear-gradient(to_right,theme(colors.gray.100)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.100)_1px,transparent_1px)] bg-[length:16px_16px]" />
        <div className="flex flex-col items-center space-y-2 relative z-10">
          <div className="flex justify-center items-center space-x-2 md:space-x-4">
            <Revo size={128} className='hidden md:block'/>
            <Revo size={64} className='block md:hidden'/>
            <h1 className="text-black text-[5rem] md:text-[10rem] font-semibold leading-none -mt-6 md:-mt-12">
              revo
            </h1>
          </div>
          <p className="text-black text-sm md:text-lg uppercase text-center max-w-md">
            your project is ready to go
          </p>
          <p className="text-black/80 text-xs tracking-wide">
            setup in under 500ms
          </p>
        </div>
      </div>
      <div className="h-[10vh] w-full border-t border-gray-400">
        <div className="h-full w-full md:w-[70vw] mx-auto border-x border-gray-400" />
      </div>
    </div>
  );
}
