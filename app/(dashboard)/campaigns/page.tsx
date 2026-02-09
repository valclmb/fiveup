"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CampaignsPage() {
  const [step, setStep] = useState<number>(0);

  const value = {
    1: "time",
    2: "message",
  }
  return <div>
    <Card className="max-w-2xl">
      <CardContent className="space-y-4 flex justify-between">
        <section>
          <div className="flex items-center gap-2">
            <Switch />
            <Label>Review after purchases</Label>
          </div>
          <Typography variant="description" affects="muted">
            Automatically send a review request after a purchase.
          </Typography>
        </section>
        <section>
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button>Configure campaign</Button>
            </DrawerTrigger>
            <DrawerContent className="p-8 gap-6 min-w-xl">
              <DrawerHeader className="flex justify-between p-0">
                <DrawerTitle >
                  <Typography variant="h3" className="font-semibold">  Configure campaign</Typography>
                </DrawerTitle>
              </DrawerHeader>

              <Separator />
              <Accordion type="single" defaultValue="time" collapsible className="gap-6" value={value[step as keyof typeof value]} onValueChange={(value) => setStep(Object.keys(value).indexOf(value) + 1)}>
                <AccordionItem value="time">
                  <AccordionTrigger className="flex items-center gap-2">
                    <div className="text-lg font-bold rounded-full size-8 flex items-center justify-center bg-accent text-accent-foreground">1</div>
                    When the message will be sent?
                  </AccordionTrigger>
                  <AccordionContent>
                    BLABLA
                    <Button onClick={() => setStep(1)}>Next <ArrowRight /></Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="message" disabled={step < 1}>
                  <AccordionTrigger className="flex items-center gap-2">
                    <div className=" text-lg font-bold rounded-full size-8 flex items-center justify-center bg-accent text-accent-foreground">2</div>
                    Message
                  </AccordionTrigger>
                  <AccordionContent>
                    BLABLA
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DrawerContent>
          </Drawer>
        </section>

      </CardContent>
    </Card>
  </div>;
}