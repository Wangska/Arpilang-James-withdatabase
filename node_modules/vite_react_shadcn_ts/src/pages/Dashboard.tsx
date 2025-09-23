import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Archive, 
  User, 
  LogOut,
  Menu,
  X,
  Crown,
  FileText,
  Home,
  Tags
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateBillModal } from "@/components/modals/CreateBillModal";
import { ViewBillModal } from "@/components/modals/ViewBillModal";
import { EditBillModal } from "@/components/modals/EditBillModal";
import { AddExpenseModal } from "@/components/modals/AddExpenseModal";
import { CategoriesModal } from "@/components/modals/CategoriesModal";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"bills" | "archive" | "profile">("bills");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [createBillOpen, setCreateBillOpen] = useState(false);
  const [viewBillOpen, setViewBillOpen] = useState(false);
  const [editBillOpen, setEditBillOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Mock data
  const [bills, setBills] = useState<Bill[]>([
    {
      id: "1",
      name: "Weekend Trip to Mountains",
      category: "travel",
      participants: ["john@example.com", "jane@example.com", "bob@example.com", "alice@example.com"],
      totalAmount: 320.50,
      status: "active",
      createdAt: "2024-01-15",
      expenses: [
        {
          id: "exp1",
          name: "Hotel Booking",
          amount: 200.00,
          paidBy: "john@example.com",
          participants: ["john@example.com", "jane@example.com", "bob@example.com", "alice@example.com"],
          date: "2024-01-15"
        },
        {
          id: "exp2",
          name: "Gas",
          amount: 120.50,
          paidBy: "jane@example.com",
          participants: ["john@example.com", "jane@example.com", "bob@example.com", "alice@example.com"],
          date: "2024-01-15"
        }
      ]
    },
    {
      id: "2", 
      name: "Dinner at Restaurant",
      category: "food",
      participants: ["john@example.com", "jane@example.com", "bob@example.com"],
      totalAmount: 85.20,
      status: "settled",
      createdAt: "2024-01-12",
      expenses: []
    },
    {
      id: "3",
      name: "Grocery Shopping",
      category: "shopping",
      participants: ["john@example.com", "jane@example.com"],
      totalAmount: 156.75,
      status: "active", 
      createdAt: "2024-01-10",
      expenses: []
    }
  ]);

  const activeBills = bills.filter(bill => bill.status === "active");
  const archivedBills = bills.filter(bill => bill.status === "archived" || bill.status === "settled");

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

  const userProfile = {
    name: "John Doe",
    email: "john@example.com",
    nickname: "Johnny",
    username: "johndoe123",
    accountType: "Standard" as "Standard" | "Premium"
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleCreateBill = () => {
    setCreateBillOpen(true);
  };

  const handleViewBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setViewBillOpen(true);
    }
  };

  const handleEditBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (bill) {
      setSelectedBill(bill);
      setEditBillOpen(true);
    }
  };

  const handleAddExpense = () => {
    setViewBillOpen(false);
    setAddExpenseOpen(true);
  };

  const handleSaveBill = (updatedBill: Bill) => {
    setBills(bills.map(bill => bill.id === updatedBill.id ? updatedBill : bill));
  };

  const handleAddExpenseToService = (expense: any) => {
    if (selectedBill) {
      const updatedBill = {
        ...selectedBill,
        expenses: [...(selectedBill.expenses || []), expense],
        totalAmount: selectedBill.totalAmount + expense.amount
      };
      setBills(bills.map(bill => bill.id === selectedBill.id ? updatedBill : bill));
      setSelectedBill(updatedBill);
    }
  };

  const handleDeleteBill = (billId: string) => {
    toast({
      title: "Delete Bill",
      description: `Delete confirmation for bill ${billId}`,
    });
  };

  const handleArchiveBill = (billId: string) => {
    toast({
      title: "Archive Bill",
      description: `Archive confirmation for bill ${billId}`,
    });
  };

  const handleUpgradeAccount = () => {
    toast({
      title: "Upgrade Account",
      description: "Upgrade to Premium modal would open here.",
    });
  };

  const sidebarItems = [
    { id: "bills", label: "Bills", icon: FileText },
    { id: "archive", label: "Archive", icon: Archive },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">SplitWise</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
          bg-card border-r transition-transform duration-300 ease-in-out
        `}>
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center space-x-2 p-6 border-b">
            <Calculator className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SplitWise</span>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Bills Tab */}
          {activeTab === "bills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Your Bills</h1>
                  <p className="text-muted-foreground">Manage and track your shared expenses</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCategoriesOpen(true)} className="gap-2">
                    <Tags className="h-4 w-4" />
                    Categories
                  </Button>
                  <Button onClick={handleCreateBill} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Bill
                  </Button>
                </div>
              </div>

              {activeBills.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No active bills</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first bill to start splitting expenses with friends.
                    </p>
                    <Button onClick={handleCreateBill}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Bill
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {activeBills.map((bill) => (
                    <Card key={bill.id} className="hover:shadow-md transition-smooth">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {CATEGORIES[bill.category as keyof typeof CATEGORIES]?.emoji || "📝"}
                            </span>
                            <h3 className="text-lg font-semibold">{bill.name}</h3>
                            <Badge variant={bill.status === "active" ? "default" : "secondary"}>
                              {bill.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{bill.participants.length} participants</span>
                            <span>Total: ${bill.totalAmount.toFixed(2)}</span>
                            <span>Created: {new Date(bill.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewBill(bill.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBill(bill.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchiveBill(bill.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBill(bill.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Archive Tab */}
          {activeTab === "archive" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Archived Bills</h1>
                <p className="text-muted-foreground">View your completed and archived bills</p>
              </div>

              {archivedBills.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No archived bills</h3>
                    <p className="text-muted-foreground">
                      Bills you complete or archive will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {archivedBills.map((bill) => (
                    <Card key={bill.id} className="hover:shadow-md transition-smooth">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {CATEGORIES[bill.category as keyof typeof CATEGORIES]?.emoji || "📝"}
                            </span>
                            <h3 className="text-lg font-semibold">{bill.name}</h3>
                            <Badge variant="secondary">
                              {bill.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{bill.participants.length} participants</span>
                            <span>Total: ${bill.totalAmount.toFixed(2)}</span>
                            <span>Created: {new Date(bill.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewBill(bill.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
              </div>

              <div className="grid gap-6 max-w-2xl">
                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your personal details and account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                        <p className="text-foreground">{userProfile.name.split(' ')[0]}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                        <p className="text-foreground">{userProfile.name.split(' ')[1]}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nickname</label>
                      <p className="text-foreground">{userProfile.nickname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{userProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <p className="text-foreground">{userProfile.username}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Type */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Account Type</CardTitle>
                        <CardDescription>
                          {userProfile.accountType === "Premium" 
                            ? "You have unlimited access to all features"
                            : "Upgrade to Premium for unlimited bills and advanced features"
                          }
                        </CardDescription>
                      </div>
                      <Badge variant={userProfile.accountType === "Premium" ? "default" : "secondary"}>
                        <Crown className="h-3 w-3 mr-1" />
                        {userProfile.accountType}
                      </Badge>
                    </div>
                  </CardHeader>
                  {userProfile.accountType === "Standard" && (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          <p>Current limits:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Maximum 5 bills per month</li>
                            <li>Maximum 3 invitees per bill</li>
                            <li>Basic features only</li>
                          </ul>
                        </div>
                        <Button onClick={handleUpgradeAccount} variant="hero">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateBillModal open={createBillOpen} onOpenChange={setCreateBillOpen} />
      
      <ViewBillModal 
        open={viewBillOpen} 
        onOpenChange={setViewBillOpen}
        bill={selectedBill}
        onAddExpense={handleAddExpense}
      />
      
      <EditBillModal 
        open={editBillOpen} 
        onOpenChange={setEditBillOpen}
        bill={selectedBill}
        onSave={handleSaveBill}
      />
      
      <AddExpenseModal 
        open={addExpenseOpen} 
        onOpenChange={setAddExpenseOpen}
        billParticipants={selectedBill?.participants || []}
        onAddExpense={handleAddExpenseToService}
      />
      
      <CategoriesModal open={categoriesOpen} onOpenChange={setCategoriesOpen} />
    </div>
  );
};

export default Dashboard;