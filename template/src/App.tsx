import revo from './assets/revo.svg';
import revo2 from './assets/revo2.svg';
// import {motion} from 'framer-motion';

function App() {

  return (
    <>
      {/* Delete this and start your project */}

      <div className="bg-[#000000] w-dvw h-dvh flex justify-center items-center select-none">
        <img src={revo2} alt="Revo" className='absolute w-[30%] max-w-[200px] -mt-20 z-10' />
        <img src={revo} alt="Revo" className='absolute w-[60%] max-w-[400px] -mb-12 md:-mb-20 z-20' />
        <div className='bg-transparent w-dvw h-dvh absolute z-50'></div>
      </div>
    </>
  )
}

export default App
