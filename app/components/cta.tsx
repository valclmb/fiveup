


const Cta = () => {
  return (
    <div className="grid grid-cols-8 w-full rounded-2xl overflow-hidden">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={`col-span-1 bg-gray-800 border-[0.5px] border-dashed h-24`} />
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={`col-span-1 bg-gray-800 border-[0.5px] border-dashed h-24`} />
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className={`col-span-1 bg-gray-800 border-[0.5px] border-dashed h-24`} />
      ))}

    </div>
  )
}

export default Cta;