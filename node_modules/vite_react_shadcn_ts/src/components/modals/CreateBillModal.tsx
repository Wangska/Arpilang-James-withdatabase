import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, X, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const CreateBillModal = ({ open, onOpenChange }: CreateBillModalProps) => {
  const { toast } = useToast();
  const [billName, setBillName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [invitationCode, setInvitationCode] = useState("ABC123XYZ");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  const generateNewCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const newCode = Array.from({ length: 9 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setInvitationCode(newCode.slice(0, 3) + newCode.slice(3, 6) + newCode.slice(6, 9));
  };

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

    toast({
      title: "Bill Created",
      description: `"${billName}" has been created successfully.`
    });

    // Reset form
    setBillName("");
    setSelectedCategory("");
    setParticipants([]);
    setNewParticipant("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bill</DialogTitle>
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
            <Label>Invitation Code</Label>
            <div className="flex items-center gap-2">
              <Input value={invitationCode} readOnly className="font-mono" />
              <Button size="icon" variant="outline" onClick={generateNewCode}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add Participants</Label>
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
              Create Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};