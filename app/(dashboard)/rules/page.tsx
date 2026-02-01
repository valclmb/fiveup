"use client";
import { StarIcon, StarIcons } from "@/app/(landing)/components/star-icon";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import Image from "next/image";
import { useState } from "react";

const RuleRow = ({ note, defaultAction }: { note: number, defaultAction: string }) => {
  const [action, setAction] = useState(defaultAction);
  return (
    <TableRow className="border-0 bg-background [&>td]:border-border [&>td]:border-t [&>td]:border-b  [&>td]:py-3 [&>td]:px-4 [&>td]:align-middle [&>td:first-child]:border-l [&>td:first-child]:rounded-l-lg [&>td:last-child]:border-r [&>td:last-child]:rounded-r-lg hover:[&>td]:bg-muted/30">
      <TableCell className="w-42 flex-shrink-0"><StarIcons starsFilled={note} /> </TableCell>
      <TableCell className="w-82">
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-82"><SelectValue placeholder="Select an action" /></SelectTrigger>
          <SelectContent  >
            <SelectItem value="redirect-platform">Redirect to Review Plateform</SelectItem>
            <SelectItem value="redirect-feedback">Redirect to Feedback Page</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="w-full" >
        {action === "redirect-platform" && <Select >
          <SelectTrigger className="w-82"><SelectValue placeholder="Select an action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="google"><Image src="/images/google-icon.svg" alt="Google" width={20} height={20} />Google</SelectItem>
            <SelectItem value="trustpilot"><StarIcon />Trustpilot</SelectItem>
          </SelectContent>
        </Select>}
      </TableCell>
    </TableRow>)
}

export default function RulesPage() {
  return (
    <Card>
      <CardContent>
        <Table className="border-separate [border-spacing:0_0.75rem]">
          <TableHeader >
            <TableRow className="hover:bg-transparent">
              <TableHead className="border-b-2 border-muted pb-2">Note</TableHead>
              <TableHead className="border-b-2 border-muted pb-2">Action</TableHead>
              <TableHead className="border-b-2 border-muted pb-2">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RuleRow note={5} defaultAction="redirect-platform" />
            <RuleRow note={4} defaultAction="redirect-platform" />
            <RuleRow note={3} defaultAction="redirect-feedback" />
            <RuleRow note={2} defaultAction="redirect-feedback" />
            <RuleRow note={1} defaultAction="redirect-feedback" />

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}