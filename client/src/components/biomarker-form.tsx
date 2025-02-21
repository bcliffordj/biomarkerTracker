import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { insertBiomarkerEntrySchema, type InsertBiomarkerEntry, biomarkerLabels, biomarkerNames } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BasicDatePicker } from "@/components/ui/basic-date-picker";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BiomarkerForm() {
  const { toast } = useToast();

  const form = useForm<InsertBiomarkerEntry>({
    resolver: zodResolver(insertBiomarkerEntrySchema),
    defaultValues: {
      date: new Date(),
      sleep: 5,
      sexDrive: 5,
      bloating: 5,
      gas: 5,
      dailyPoop: 5,
      overallDigestion: 5,
      strength: 5,
      stamina: 5,
      articulation: 5,
      mood: 5,
      energy: 5,
      mindSharpness: 5,
      creativity: 5,
      inspiration: 5,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: InsertBiomarkerEntry) => {
      console.log('Sending date:', values.date);
      const res = await apiRequest("POST", "/api/biomarkers", values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/biomarkers"] });
      toast({
        title: "Success",
        description: "Entry added successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <BasicDatePicker
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  startYear={2020}
                  endYear={2025}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {biomarkerNames.map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{biomarkerLabels[name]}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Entry"}
        </Button>
      </form>
    </Form>
  );
}