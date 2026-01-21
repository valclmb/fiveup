import { StarIcon } from "@/app/components/star-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import RatingCards from "./rating-cards";

const Hero = () => {
  return (
    <div className='relative w-full flex flex-col items-center gap-6 mb-28 sm:mb-24 md:mb-32 '>
      <Badge variant="secondary">Gestion des avis</Badge>
      <Typography variant="h1" className="text-center">
        Transformez chaque client
        <div className="inline ml-2 xs:ml-0 sm:flex items-center justify-center gap-2">en <span className="text-primary">avis 5 </span><StarIcon size={42} className="inline xs:block xs:-translate-y-1 size-5 md:size-auto" /></div>
      </Typography>

      <Typography variant="p" className="text-center max-w-sm md:max-w-lg mx-auto text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris a ex posuere luctus sit amet ac mi.</Typography>
      <Button className="mt-2">Commencer maintenant</Button>
      <Typography variant="p" className="text-sm sm:text-base my-4 md:mt-8 flex gap-2 items-center">
        <StarIcon className="text-background bg-primary p-1 rounded-full" size={24} />
        Rated <span className="font-bold"> 4.9/5</span> from over <span className="font-bold">600</span> reviews.
      </Typography>


      <RatingCards />

    </div>
  )

}
export default Hero;