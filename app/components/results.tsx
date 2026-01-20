import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { LandingBlock } from "./landing-block";
import { StarIcons } from "./star-icon";

const results = [{
  title: "2x more",
  description: "public review for online store",
  review: {
    content: "We stopped thinking about reviews. FiveUp just keeps Google and Trustpilot growing in the background while we focus on ads and product.",
    author: "E-commerce founder"
  }
},
{
  title: "60% fewer",
  description: "bad surprises on public pages",
  review: {
    content: "After each appointment, clients get a quick message. Happy ones go to Google, others talk to us directly. Our rating finally reflects our real work.",
    author: "Salon owner"
  }
},
{
  title: "1 dashboard",
  description: "All your clients",
  review: {
    content: "FiveUp turned reviews from a stressful chore into a system. The tool is flexible enough for any business and simple enough for the whole team to use.",
    author: "Marketing manager"
  }
},]

const Results = () => {
  return (
    <LandingBlock badge="Résultats" title="Des avis qui parlent pour vous.">
      <div className="space-y-6">
        {results.map((result, index) => (
          <div key={index} className="flex gap-6 even:flex-row-reverse items-stretch">
            <Card className="w-1/4 flex">
              <CardContent className="flex flex-col items-center justify-center h-full w-full">
                <Typography variant="p" className="text-4xl font-bold">{result.title}</Typography>
                <Typography variant="p" className="text-md text-white/80">{result.description}</Typography>
              </CardContent>
            </Card>
            <Card className="flex-1 space-y-4">
              <CardContent className="space-y-4 py-6 px-10">
                <StarIcons size={19} />
                <Typography variant="p">"{result.review.content}"</Typography>
                <Typography variant="p">{result.review.author}</Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </LandingBlock>
  );
};

export default Results;