"use client";
import DarkVeil from "@/components/DarkVeil";

const AnimatedBackground = () => {
  const primary = "#00f8b9"


  return (
    // <Aurora
    //   className='absolute inset-0 h-[80vh] '
    //   colorStops={[primary, primary, primary]}
    //   blend={1.0}
    //   amplitude={1.0}
    //   speed={0.2}
    // />
    <div style={{ width: '100%', height: '1500px', position: 'absolute' }}>


      <DarkVeil
        tintColor={primary}
        hueShift={400}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0.1}
      />
    </div>

  )
}

export default AnimatedBackground;