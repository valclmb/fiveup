import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import Typography from "@/components/ui/typography";
import Image from "next/image";
import { StarIcons } from "./star-icon";

const reviews = [
  {
    name: "Veona Watson",
    username: "@hi.veona",
    title: "On a enfin repris le contrôle de nos avis.",
    body: "Avant FiveUp, on subissait les avis. Aujourd’hui, tout est automatisé : les clients satisfaits laissent des avis publics, les autres nous contactent en privé. Notre note Google a clairement progressé.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    title: "Simple à mettre en place.",
    body: "Après chaque prestation, le message part automatiquement. Les bons avis vont sur Google, les retours négatifs arrivent directement chez nous. Notre réputation reflète enfin la qualité de notre travail.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    title: "Un vrai gain de temps",
    body: "On gère plusieurs établissements et FiveUp nous permet de tout centraliser dans un seul dashboard. C’est clair, fluide, et les résultats sont mesurables.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Veona Watson",
    username: "@hi.veona",
    title: "On a enfin repris le contrôle de nos avis.",
    body: "Avant FiveUp, on subissait les avis. Aujourd’hui, tout est automatisé : les clients satisfaits laissent des avis publics, les autres nous contactent en privé. Notre note Google a clairement progressé.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    title: "Simple à mettre en place.",
    body: "Après chaque prestation, le message part automatiquement. Les bons avis vont sur Google, les retours négatifs arrivent directement chez nous. Notre réputation reflète enfin la qualité de notre travail.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    title: "Un vrai gain de temps",
    body: "On gère plusieurs établissements et FiveUp nous permet de tout centraliser dans un seul dashboard. C’est clair, fluide, et les résultats sont mesurables.",
    img: "https://avatar.vercel.sh/john",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const Reviews = () => {
  return (
    <section className="max-w-full">
      <Typography variant="h2" className="text-center">Ce que pensent nos clients</Typography>
      <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden py-5">
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
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
      </div>

    </section>
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