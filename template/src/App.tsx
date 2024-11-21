import revo from './assets/revo.png';
import revo2 from './assets/revo2.png';
import texture from './assets/texture.jpg';
// import {motion} from 'framer-motion';

function App() {

  return (
    <>
      {/* Delete this and start your project */}

      <div className="bg-[#000000] w-dvw h-dvh flex justify-center items-center select-none">
        <img src={revo2} alt="Revo" className='absolute w-[30%] max-w-[200px] -mt-20 z-10' />
        <img src={revo} alt="Revo" className='absolute w-[60%] max-w-[400px] -mb-12 md:-mb-20 z-20' />
        <img src={texture} alt='texture' className='absolute w-dvw h-dvh opacity-10 z-30'></img>
        <div className='bg-transparent w-dvw h-dvh absolute z-50'></div>
      </div>
    </>
  )
}

export default App
