import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import type { CornerRoundness } from "@/lib/corner-roundness";

interface CornerRoundnessInputProps {
  value: CornerRoundness;
  onChange: (value: CornerRoundness) => void;
}

const CornerRoundnessInput = ({ value, onChange }: CornerRoundnessInputProps) => {
  return (
    <Tabs value={value} onValueChange={onChange} >
      <TabsList className="border rounded-lg">
        <TabsTab value="none" aria-label="Toggle top">
          none
        </TabsTab>
        <TabsTab value="sm" aria-label="Toggle bottom">
          small
        </TabsTab>
        <TabsTab value="md" aria-label="Toggle left">
          medium
        </TabsTab>
        <TabsTab value="lg" aria-label="Toggle right">
          large
        </TabsTab>
        <TabsTab value="rounded" aria-label="Toggle right">
          rounded
        </TabsTab>
      </TabsList>
    </Tabs>
  )
}

export default CornerRoundnessInput;