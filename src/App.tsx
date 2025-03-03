import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, RepeatIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

type RecurrenceType =
  | "none"
  | "daily"
  | "weekly"
  | "biWeekly"
  | "monthly"
  | "yearly"
  | "custom";

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [customDays, setCustomDays] = useState<number>(4);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false);
  };

  const handleRecurrenceToggle = (checked: boolean) => {
    setIsRecurring(checked);
    if (!checked) {
      setRecurrenceType("none");
    } else if (recurrenceType === "none") {
      setRecurrenceType("weekly");
    }
  };

  const getRecurrenceText = () => {
    switch (recurrenceType) {
      case "daily":
        return "Repeats every day";
      case "weekly":
        return `Repeats every ${date ? format(date, "EEEE") : "week"}`;
      case "biWeekly":
        return `every 2 weeks on ${date ? format(date, "EEEE") : ""}`;
      case "monthly":
        return `Repeats monthly on the ${date ? format(date, "do") : ""}`;
      case "yearly":
        return `Repeats yearly on ${date ? format(date, "MMMM d") : ""}`;
      case "custom":
        return `Repeats every ${customDays} day${customDays !== 1 ? "s" : ""}`;
      default:
        return "No recurrence";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Date Picker for events</CardTitle>
          <CardDescription>Select a date for your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RepeatIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="recurring">Recurring Event</Label>
            </div>
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={handleRecurrenceToggle}
            />
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrence-type">Recurrence Pattern</Label>
              <Select
                value={recurrenceType}
                onValueChange={(value) =>
                  setRecurrenceType(value as RecurrenceType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biWeekly">BiWeekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              {recurrenceType === "custom" && (
                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="custom-days">Every</Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min="1"
                    value={customDays}
                    onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <span>days</span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {getRecurrenceText()}
              </p>
            </div>
          )}

          {date && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Selected Date:</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(date, "MMMM d, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Day of week:</span>{" "}
                  {format(date, "EEEE")}
                </p>
                {isRecurring && (
                  <p>
                    <span className="font-medium">Recurrence:</span>{" "}
                    {getRecurrenceText()}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setDate(undefined)}>
            Clear
          </Button>
          <Button onClick={() => setDate(new Date())}>Today</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
