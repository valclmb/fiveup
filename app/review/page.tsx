"use client";

import { ArcStarsSelector } from "@/components/features/rating";
import Typography from "@/components/ui/typography";

const Review = () => {
  return (
    <div className="p-10 bg-white h-screen flex flex-col justify-center items-center gap-5">
      <Typography variant="h1" className="text-center text-black">
        Donnez votre avis
      </Typography>
      <ArcStarsSelector />
    </div>
  );
};

export default Review