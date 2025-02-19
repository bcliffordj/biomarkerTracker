import { type BiomarkerName, biomarkerLabels, biomarkerNames } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiomarkerSelectorProps {
  selectedBiomarkers: BiomarkerName[];
  onSelectionChange: (biomarkers: BiomarkerName[]) => void;
}

export default function BiomarkerSelector({ 
  selectedBiomarkers, 
  onSelectionChange 
}: BiomarkerSelectorProps) {
  const toggleBiomarker = (biomarker: BiomarkerName) => {
    if (selectedBiomarkers.includes(biomarker)) {
      onSelectionChange(selectedBiomarkers.filter(b => b !== biomarker));
    } else {
      onSelectionChange([...selectedBiomarkers, biomarker]);
    }
  };

  const selectAll = () => {
    onSelectionChange([...biomarkerNames]);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={selectAll}
          className="flex-1"
        >
          <Check className="mr-2 h-4 w-4" />
          Select All
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearAll}
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="grid grid-cols-2 gap-2">
          {biomarkerNames.map((biomarker) => (
            <Button
              key={biomarker}
              variant={selectedBiomarkers.includes(biomarker) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleBiomarker(biomarker)}
              className="justify-start"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedBiomarkers.includes(biomarker) ? "opacity-100" : "opacity-0"
                )}
              />
              {biomarkerLabels[biomarker]}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}