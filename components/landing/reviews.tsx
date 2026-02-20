import { Star } from "lucide-react"
import { Pills } from "../custom-ui/pills"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Marquee } from "../ui/marquee"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"


const reviewsItems = [
  {
    name: "Borel",
    username: "@borel",
    body: "After each service, the message is automatically sent. Good reviews go to Google, negative feedback comes directly to us. Our reputation finally reflects the quality of our work.",
    img: "/landing/reviews/Borel.jpeg",
  },
  {
    name: "Demoliere",
    username: "@demoliere",
    body: "We manage several establishments and FiveUp allows us to centralize everything in a single dashboard. It's clear, fluid, and the results are measurable.",
    img: "/landing/reviews/Demoliere.jpeg",
  },
  {
    name: "Gaujard",
    username: "@gaujard",
    body: "Before FiveUp, we suffered from reviews. Today, everything is automated: satisfied customers leave public reviews, others contact us privately. Our Google rating has clearly improved.",
    img: "/landing/reviews/Gaujard.jpeg",
  },
  {
    name: "Komjanck",
    username: "@komjanck",
    body: "We were looking for a solution to manage our reviews and FiveUp was the perfect fit. It's easy to use, and the results are amazing.",
    img: "/landing/reviews/Komjanck.jpeg",
  },
  {
    name: "Prieux",
    username: "@prieux",
    body: "FiveUp has completely transformed our approach to managing reviews. It's not just about collecting feedback—it's about actively engaging with our customers and addressing their concerns. The dashboard is intuitive, and the integration with our website is seamless. I highly recommend it!",
    img: "/landing/reviews/Prieux.jpeg",
  },
  {
    name: "Salsa",
    username: "@salsa",
    body: "FiveUp has made managing our reviews a breeze. The automated system ensures that we receive feedback promptly, and the integration with our Google Business Profile is seamless. It's a great tool for any business looking to improve their online reputation.",
    img: "/landing/reviews/Salsa.jpeg",
  },
]


const reviewsLength = reviewsItems.length
const firstRow = reviewsItems.slice(0, reviewsLength / 2)
const secondRow = reviewsItems.slice(reviewsLength / 2)


const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <Card className="max-w-96 p-6">
      <CardHeader className="flex justify-between p-0">
        <div className="flex flex-row items-center gap-3">
          <Avatar className="size-[42px]">
            <AvatarImage alt="" src={img} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-lg font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-sm font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
        <Pills variant="default">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={14} className="text-foreground fill-foreground" />
          ))}
        </Pills>

      </CardHeader>
      <CardContent className="p-0">
        <Typography variant="p" affects="mutedDescription">{body}</Typography>
      </CardContent>
    </Card >
  )
}

export const Reviews = () => {
  return (
    <LandingBlock>
      <LandingBlock.Title>
        What our client say
      </LandingBlock.Title>
      <LandingBlock.Content>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-3">
          <Marquee pauseOnHover className="[--duration:40s] [--gap:24px]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s] [--gap:24px]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l"></div>
        </div>
      </LandingBlock.Content>
    </LandingBlock>
  )
}