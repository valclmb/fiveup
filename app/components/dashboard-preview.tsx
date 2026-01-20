"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { Bell, Clock, LayoutDashboard, Link, Megaphone, Menu, MessageCircle, PanelsTopLeft, Percent, Settings, Star } from "lucide-react";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid } from "recharts";
import { StarIcons } from "./star-icon";

const chartData1 = [
  { data: 180 },
  { data: 220 },
  { data: 200 },
  { data: 400 },
  { data: 370 },
  { data: 480 },
  { data: 480 },
  { data: 300 },
  { data: 380 },
  { data: 350 },
  { data: 270 },
  { data: 400 },
  { data: 550 },
  { data: 550 },
]

const chartData2 = [
  { data: 180 },
  { data: 220 },
  { data: 200 },
  { data: 400 },
  { data: 370 },
  { data: 480 },
  { data: 480 },
  { data: 300 },
]

const chartConfig = {
  data: {
    label: "Data",
    color: "var(--primary)",
  }
}
const DashboardPreview = () => {




  return (
    <section className="space-y-6 w-full py-16">
      <div className="space-y-2">
        <Typography variant="h2">A complete management of your reviews</Typography>
        <Typography variant="description">Lorem ipsum dollores Lorem ipsum dollores Lorem ipsum dollores Lorem ipsum dollores Lorem ipsum dollores Lorem ipsum dollores Lorem ipsum dollores</Typography>
      </div>

      {/* Mockup dashboard */}
      <div className="border-2 border-ring w-full h-[670] rounded-4xl flex overflow-hidden">
        {/* Sidebar */}
        <div className=" bg-accent  border-r  border-ring">
          <div className="h-16 w-full border-b border-ring"/>
          <div className="flex flex-col items-center gap-4 p-4">
        
            <div  className="bg-background p-2 rounded-md border border-ring">
            <LayoutDashboard className="text-primary" size={18}/>
            </div>
            
            {[Star, Megaphone, Settings, PanelsTopLeft, Link].map((Icon, index) => (
              <div key={index} className=" p-2">
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>
    
       <div className="flex flex-col w-full">
        {/* Header */}
        <div className="h-16 p-4 flex items-center justify-between bg-accent w-full border-b border-ring">
          <Menu/>
          {/* Search bar  */}
          <div className="min-w-96 p-5 border border-ring rounded-md">

          </div>
          <div className="flex items-center gap-2">
            <Bell/>
          {/* Avatar  */}
          <div className="size-8 bg-linear-to-br from-primary to-tertiary  rounded-full"/>
          </div>
        </div>
        {/* Content */}
       <div className="grid grid-cols-12 gap-3 p-3">
     

       {[MessageCircle, Clock, Percent].map((Icon, index) => (
          <Card key={index} className="w-full flex-row items-center p-3 bg-accent border border-ring col-span-4">
            <div className="space-y-2 flex-1">
                <Skeleton pulse={false} className="w-1/2 h-2 rounded-full bg-ring"/>
                <Skeleton pulse={false} className="w-1/3 h-2 rounded-full bg-ring"/>
            </div>
            <div className="p-2 rounded-md bg-tertiary ">
            <Icon className="text-primary" size={16}/>
            </div>
          </Card>
        ))}
        {/* Chart */}
        <Card className="col-span-7 bg-accent border border-ring">
        <ChartContainer config={chartConfig} className="max-h-42">
          <AreaChart
            accessibilityLayer
            data={chartData1}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="var(--ring)"
              opacity={0.3}
            />
            
            
            <defs>
              <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-data)"
                  stopOpacity={0}
                />
              </linearGradient>
              
            </defs>
            
            <Area
              dataKey="data"
              type="natural"
              fill="url(#fillData)"
              fillOpacity={0.4}
              stroke="var(--color-data)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        </Card>
        {/* Top Sources */}
        <Card className="col-span-5 bg-accent border border-ring">
          <CardContent className="space-y-4">
          <div className="font-bold">Top Sources</div>
          <div className="flex gap-2">
          {/* Trustpilot */}
          <Card className="p-2 w-1/3">
            <CardContent className="p-2 space-y-4">
            <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={100} height={16} />
            <Skeleton pulse={false} className="w-full h-2 rounded-full bg-ring"/>
            <StarIcons/>
            </CardContent>
          </Card>
          {/* Google */}
          <Card className="p-2 w-1/3 ">
            <CardContent className="p-2 space-y-4">
            <Image src="/images/google-logo.svg" alt="Google" width={70} height={16} />
            <Skeleton pulse={false} className="w-full h-2 rounded-full bg-ring"/>
            <StarIcons/>
            </CardContent>
          </Card>             
          </div>
          </CardContent>
        
        </Card>
        <Card className="col-span-7 bg-accent border border-ring">
          <CardContent className="p-4 ">
            {Array.from({ length: 4 }).map((_, index) => {
              const isTrustpilot = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex items-center  gap-6 p-3 rounded-lg ${
                    index % 2 === 1 ? "bg-background/80" : ""
                  }`}
                >
                  {/* Left section - Placeholders */}
                  <div className="flex-1 space-y-2">
                    <Skeleton
                      pulse={false}
                      className="h-2 rounded-full bg-ring w-2/3"
                    />
                    <Skeleton
                      pulse={false}
                      className="h-2 rounded-full bg-ring w-1/3"
                    />
                  </div>
                  {/* Middle section - Additional placeholder */}
                  <div className="space-y-2">
                    <Skeleton
                      pulse={false}
                      className="h-2 rounded-full bg-ring w-20"
                    />
                  </div>
                  {/* Right section - Stars and Logo */}
                  <div className="flex items-center gap-8">
                    <StarIcons size={14} />
                    <div className="min-w-20">

                    <Image
                        src={isTrustpilot ? "/images/trustpilot-logo.svg" : "/images/google-logo.svg"}
                        alt={isTrustpilot ? "Trustpilot" : "Google"}
                        width={isTrustpilot ? 80 : 60}
                        height={16}
                      />
                      </div>
              
                      
                  
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="col-span-5 bg-accent border border-ring">
        <ChartContainer config={chartConfig}  className="max-h-56">
          <AreaChart
            accessibilityLayer
            data={chartData1}
            margin={{
              left: 12,
              right: 12,
            }}
            
          >
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="var(--ring)"
              opacity={0.3}
            />
            
            
            <defs>
              <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-data)"
                  stopOpacity={0}
                />
              </linearGradient>
              
            </defs>
            
            <Area
              dataKey="data"
              type="natural"
              fill="url(#fillData)"
              fillOpacity={0.4}
              stroke="var(--color-data)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        </Card>

       </div>
       </div>
      </div>

     
    </section>
  )
}

export default DashboardPreview;