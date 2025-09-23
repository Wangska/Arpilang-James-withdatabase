import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Plus, FileText } from "lucide-react";

interface Bill {
  id: string;
  name: string;
  category: string;
  participants: string[];
  totalAmount: number;
  status: "active" | "settled" | "archived";
  createdAt: string;
  expenses?: Expense[];
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  participants: string[];
  date: string;
}

interface ViewBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: Bill | null;
  onAddExpense?: () => void;
}

const CATEGORIES = {
  food: { name: "Food & Dining", emoji: "🍽️" },
  transportation: { name: "Transportation", emoji: "🚗" },
  entertainment: { name: "Entertainment", emoji: "🎬" },
  shopping: { name: "Shopping", emoji: "🛍️" },
  utilities: { name: "Utilities", emoji: "💡" },
  healthcare: { name: "Healthcare", emoji: "🏥" },
  travel: { name: "Travel", emoji: "✈️" },
  other: { name: "Other", emoji: "📝" }
};

export const ViewBillModal = ({ open, onOpenChange, bill, onAddExpense }: ViewBillModalProps) => {
  if (!bill) return null;

  const category = CATEGORIES[bill.category as keyof typeof CATEGORIES] || CATEGORIES.other;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{category.emoji}</span>
            <span>{bill.name}</span>
            <Badge variant={bill.status === "active" ? "default" : "secondary"}>
              {bill.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bill Info */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{bill.participants.length}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">${bill.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{bill.expenses?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Expenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Expenses Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Expenses</h3>
              <Button size="sm" onClick={onAddExpense}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>

            {!bill.expenses || bill.expenses.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">No expenses yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first expense to this bill.
                  </p>
                  <Button onClick={onAddExpense}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Expense
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {bill.expenses.map((expense) => (
                  <Card key={expense.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{expense.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Paid by {expense.paidBy} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Split between {expense.participants.length} participant(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            ${(expense.amount / expense.participants.length).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};