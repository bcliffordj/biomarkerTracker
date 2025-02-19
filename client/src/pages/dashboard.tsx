import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BiomarkerForm from "@/components/biomarker-form";
import BiomarkerGraph from "@/components/biomarker-graph";
import BiomarkerSelector from "@/components/biomarker-selector";
import { useState } from "react";
import type { BiomarkerName } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [selectedBiomarkers, setSelectedBiomarkers] = useState<BiomarkerName[]>([
    "sleep", "mood", "energy"
  ]);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["/api/biomarkers"],
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Biomarker Tracking</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <BiomarkerForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Biomarkers</CardTitle>
          </CardHeader>
          <CardContent>
            <BiomarkerSelector 
              selectedBiomarkers={selectedBiomarkers}
              onSelectionChange={setSelectedBiomarkers}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biomarker Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <Skeleton className="w-full h-[400px]" />
          ) : (
            <BiomarkerGraph 
              entries={entries || []}
              selectedBiomarkers={selectedBiomarkers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
