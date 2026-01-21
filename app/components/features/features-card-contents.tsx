import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Check, Mail, Star } from "lucide-react"
import Image from "next/image"
import { StarIcon, StarIcons } from "../star-icon"

export const Connect = () => {
  return (
    <div className="relative bg-accent rounded-xl p-4">
      <div className="relative flex items-center justify-between">
        {/* Ligne de progression verte */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0"></div>
        {/* 4 cercles avec checkmarks */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="relative z-10 bg-primary rounded-full p-2 flex items-center justify-center">
            <Check className="text-primary-foreground" width={16} height={16} strokeWidth={3} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const AutomaticConnection = () => {
  return (
    <div className="flex gap-4">
      <Card className="bg-accent p-0 w-full">
        <CardContent className="flex items-center justify-between gap-14 p-4">
          <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={80} height={30} />
          <Badge variant="secondary" className=" rounded-md">
            <div className="size-2 bg-primary rounded-full"></div>
            Connecté
          </Badge>

        </CardContent>

      </Card>
      <Card className="bg-accent  p-0 w-full">
        <CardContent className="flex items-center justify-between gap-14 p-4">
          <Image src="/images/google-logo.svg" alt="Google Business" width={60} height={30} />
          <Badge variant="secondary" className=" rounded-md">
            <div className="size-2 bg-primary rounded-full"></div>
            Connecté
          </Badge>

        </CardContent>

      </Card>

    </div>
  )
}

export const AutoReply = () => {
  return (
    <div className="space-y-3 bg-accent rounded-xl p-3">
      {/* message incoming */}
      <div className="flex justify-start">
        <div className="flex items-center justify-between bg-card rounded-2xl rounded-bl-xs px-3 py-2 gap-8 max-w-[80%]">
          <p className="text-white">Amazing service</p>
          <div className="flex gap-1">
            <StarIcons />
          </div>
        </div>
      </div>
      {/*  message outgoing */}
      <div className="flex justify-end">
        <div className="bg-primary  rounded-2xl rounded-br-xs px-3 py-2 gap-8 max-w-[80%] flex items-center ">
          <p className="text-primary-foreground">Glad to hear that!</p>
          <Badge variant="default" className="bg-white">
            Auto Reply
          </Badge>
        </div>
      </div>
    </div>
  )
}

export const ProtectReputation = () => {
  return (
    <div className="relative bg-accent rounded-xl px-4 py-8">
      <div className="relative flex items-center justify-between">
        {/* Dashed line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-muted-foreground z-0"></div>

        {/* 1st element with red bubble and star */}
        <div className="relative z-10 bg-destructive rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
          <span className="text-white font-semibold">1</span>
          <Star className="text-white fill-white" width={16} height={16} />
          {/* Triangle pointing down */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent border-t-destructive"></div>
        </div>

        {/* 2nd element with arrow in the center */}
        <div className="relative z-10 bg-card rounded-lg p-3 flex items-center justify-center">
          <ArrowRight className="text-white" width={20} height={20} />
        </div>

        {/* 3rd element with private support */}
        <div className="relative z-10 bg-card rounded-lg px-4 py-3 flex items-center gap-2">
          <Mail className="text-white" width={18} height={18} strokeWidth={2} />
          <span className="text-white text-sm">Private support</span>
        </div>
      </div>
    </div>
  )
}

export const CustomFlows = () => {
  return (
    <div className="space-y-4">
      {/* Ligne 1 : Switch ON avec 5 étoiles */}
      <div className="flex items-center justify-between gap-4 bg-accent rounded-lg p-4">
        <Switch checked={true} />
        <div className="flex gap-1">
          <StarIcons />
        </div>
        <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={80} height={30} />
      </div>

      {/* Ligne 2 : Switch OFF avec 4 étoiles */}
      <div className="flex items-center justify-between gap-4 bg-accent rounded-lg p-4">
        <Switch checked={false} />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <StarIcon key={index} className="text-amber-300" size={20} />
          ))}
          <StarIcon outline={true} strokeWidth={4} className="text-amber-300 " size={20} />

        </div>
        <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={80} height={30} />
      </div>
    </div>
  )
}