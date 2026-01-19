import { LandingBlock } from "../landing-block";
import ReviewsCard from "./reviews-card";


export const Reviews = () => {
  return (
   <LandingBlock badge="Reviews" title="Reviews on autopilot. Zero headache.">
    <ReviewsCard />
   </LandingBlock>
  );
};