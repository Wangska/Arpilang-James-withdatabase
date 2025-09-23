import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billParticipants?: string[];
  onAddExpense?: (expense: any) => void;
}

export const AddExpenseModal = ({ open, onOpenChange, billParticipants = [], onAddExpense }: AddExpenseModalProps) => {
  const { toast } = useToast();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customParticipants, setCustomParticipants] = useState<string[]>([]);

  const handleParticipantToggle = (participant: string, checked: boolean) => {
    if (checked) {
      setCustomParticipants([...customParticipants, participant]);
    } else {
      setCustomParticipants(customParticipants.filter(p => p !== participant));
    }
  };

  const handleSubmit = () => {
    if (!expenseName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an expense name.",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    if (!paidBy) {
      toast({
        title: "Error",
        description: "Please select who paid for this expense.",
        variant: "destructive"
      });
      return;
    }

    if (splitType === "custom" && customParticipants.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one participant for custom split.",
        variant: "destructive"
      });
      return;
    }

    const participants = splitType === "equal" ? billParticipants : customParticipants;
    
    const expense = {
      id: Math.random().toString(36).substr(2, 9),
      name: expenseName,
      amount: parseFloat(amount),
      paidBy,
      participants,
      date: new Date().toISOString()
    };

    onAddExpense?.(expense);
    
    toast({
      title: "Expense Added",
      description: `"${expenseName}" has been added successfully.`
    });

    // Reset form
    setExpenseName("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setCustomParticipants([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expenseName">Expense Name</Label>
            <Input
              id="expenseName"
              placeholder="What did you spend on?"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid for this?" />
              </SelectTrigger>
              <SelectContent>
                {billParticipants.map((participant) => (
                  <SelectItem key={participant} value={participant}>
                    {participant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Split</Label>
            <RadioGroup value={splitType} onValueChange={(value) => setSplitType(value as "equal" | "custom")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">Split equally among all participants</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom split</Label>
              </div>
            </RadioGroup>

            {splitType === "custom" && (
              <div className="space-y-2 pl-6">
                <Label className="text-sm text-muted-foreground">Select participants:</Label>
                <div className="space-y-2">
                  {billParticipants.map((participant) => (
                    <div key={participant} className="flex items-center space-x-2">
                      <Checkbox
                        id={participant}
                        checked={customParticipants.includes(participant)}
                        onCheckedChange={(checked) => handleParticipantToggle(participant, checked as boolean)}
                      />
                      <Label htmlFor={participant} className="text-sm">
                        {participant}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};