import { AnimatedFade } from "@/components/custom-ui/animated-fade";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import Typography from "@/components/ui/typography";
import Image from "next/image";
import { StarIcons } from "./star-icon";

const reviews = [
  {
    name: "Veona Watson",
    username: "@hi.veona",
    title: "We finally took control of our reviews.",
    body: "Before FiveUp, we suffered from reviews. Today, everything is automated: satisfied customers leave public reviews, others contact us privately. Our Google rating has clearly improved.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    title: "Easy to set up.",
    body: "After each service, the message is automatically sent. Good reviews go to Google, negative feedback comes directly to us. Our reputation finally reflects the quality of our work.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    title: "A real time saver",
    body: "On gère plusieurs établissements et FiveUp nous permet de tout centraliser dans un seul dashboard. C’est clair, fluide, et les résultats sont mesurables.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Veona Watson",
    username: "@hi.veona",
    title: "We finally took control of our reviews.",
    body: "Before FiveUp, we suffered from reviews. Today, everything is automated: satisfied customers leave public reviews, others contact us privately. Our Google rating has clearly improved.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    title: "Easy to set up.",
    body: "After each service, the message is automatically sent. Good reviews go to Google, negative feedback comes directly to us. Our reputation finally reflects the quality of our work.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    title: "A real time saver",
    body: "We manage several establishments and FiveUp allows us to centralize everything in a single dashboard. It’s clear, fluid, and the results are measurable.",
    img: "https://avatar.vercel.sh/john",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const Reviews = () => {
  return (
    <AnimatedFade as="section" className="w-full max-w-full">
      <Typography variant="h2" className="text-center">What our clients say</Typography>
      <div className=" relative w-full flex flex-col items-center justify-center gap-4 overflow-hidden py-5">
        <Marquee pauseOnHover className="[--duration:50s] [--gap:2rem]" >
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:50s] [--gap:2rem]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* -left/right-px évite un éventuel "hairline" 1px aux bords (arrondis/sub-pixels) */}
        <div className="from-background pointer-events-none absolute inset-y-0 -left-px w-1/4 bg-linear-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 -right-px w-1/4 bg-linear-to-l"></div>
      </div>
    </AnimatedFade>
  )
}

export default Reviews;


const ReviewCard = ({
  img,
  name,
  title,
  username,
  body,
}: {
  img: string,
  name: string,
  username: string,
  title: string,
  body: string
}) => {
  return (
    <Card
      className="max-w-96 flex flex-col h-full">
      <CardContent className="flex flex-col justify-between flex-1 ">
        <Typography variant="blockquote" className="text-lg font-bold">{title}</Typography>
        <StarIcons size={15} className="my-2" />

        <Typography variant="blockquote" className="text-sm">{body}</Typography>
        <div className="flex flex-row items-center gap-2 mt-4">
          <Image className="rounded-full" width={32} height={32} alt="profil pic" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}