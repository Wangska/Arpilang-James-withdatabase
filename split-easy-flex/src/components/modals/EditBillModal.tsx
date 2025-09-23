import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: string;
  name: string;
  category: string;
  participants: string[];
  totalAmount: number;
  status: "active" | "settled" | "archived";
  createdAt: string;
  expenses?: any[];
}

interface EditBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill | null;
  onSave?: (updatedBill: Bill) => void;
}

const CATEGORIES = [
  { id: "food", name: "Food & Dining", emoji: "🍽️" },
  { id: "transportation", name: "Transportation", emoji: "🚗" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬" },
  { id: "shopping", name: "Shopping", emoji: "🛍️" },
  { id: "utilities", name: "Utilities", emoji: "💡" },
  { id: "healthcare", name: "Healthcare", emoji: "🏥" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "other", name: "Other", emoji: "📝" }
];

export const EditBillModal = ({ open, onOpenChange, bill, onSave }: EditBillModalProps) => {
  const { toast } = useToast();
  const [billName, setBillName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  useEffect(() => {
    if (bill) {
      setBillName(bill.name);
      setSelectedCategory(bill.category);
      setParticipants(bill.participants || []);
    }
  }, [bill]);

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleSubmit = () => {
    if (!billName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a bill name.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive"
      });
      return;
    }

    if (!bill) return;

    const updatedBill = {
      ...bill,
      name: billName,
      category: selectedCategory,
      participants
    };

    onSave?.(updatedBill);
    
    toast({
      title: "Bill Updated",
      description: `"${billName}" has been updated successfully.`
    });

    onOpenChange(false);
  };

  if (!bill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="billName">Bill Name</Label>
            <Input
              id="billName"
              placeholder="Enter bill name..."
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Email or username..."
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addParticipant()}
              />
              <Button size="icon" onClick={addParticipant}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((participant) => (
                  <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                    <UserPlus className="h-3 w-3" />
                    {participant}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeParticipant(participant)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};