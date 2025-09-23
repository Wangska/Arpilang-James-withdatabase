import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  emoji: string;
  isDefault: boolean;
}

interface CategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", emoji: "🍽️", isDefault: true },
  { id: "transportation", name: "Transportation", emoji: "🚗", isDefault: true },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", isDefault: true },
  { id: "shopping", name: "Shopping", emoji: "🛍️", isDefault: true },
  { id: "utilities", name: "Utilities", emoji: "💡", isDefault: true },
  { id: "healthcare", name: "Healthcare", emoji: "🏥", isDefault: true },
  { id: "travel", name: "Travel", emoji: "✈️", isDefault: true },
  { id: "other", name: "Other", emoji: "📝", isDefault: true }
];

export const CategoriesModal = ({ open, onOpenChange }: CategoriesModalProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
      emoji: newCategoryEmoji || "📝",
      isDefault: false
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryEmoji("");
    setIsAdding(false);

    toast({
      title: "Category Added",
      description: `"${newCategory.name}" has been added successfully.`
    });
  };

  const handleEditCategory = (id: string, name: string, emoji: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name, emoji } : cat
    ));
    setEditingId(null);

    toast({
      title: "Category Updated",
      description: "Category has been updated successfully."
    });
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default categories cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Manage Categories</span>
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Category Form */}
          {isAdding && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="emoji">Emoji</Label>
                      <Input
                        id="emoji"
                        placeholder="📝"
                        value={newCategoryEmoji}
                        onChange={(e) => setNewCategoryEmoji(e.target.value)}
                        className="text-center"
                        maxLength={2}
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter category name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setIsAdding(false);
                      setNewCategoryName("");
                      setNewCategoryEmoji("");
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid gap-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  {editingId === category.id ? (
                    <EditCategoryForm
                      category={category}
                      onSave={handleEditCategory}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.emoji}</span>
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          {category.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(category.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!category.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditCategoryFormProps {
  category: Category;
  onSave: (id: string, name: string, emoji: string) => void;
  onCancel: () => void;
}

const EditCategoryForm = ({ category, onSave, onCancel }: EditCategoryFormProps) => {
  const [name, setName] = useState(category.name);
  const [emoji, setEmoji] = useState(category.emoji);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(category.id, name.trim(), emoji || "📝");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label htmlFor="edit-emoji">Emoji</Label>
          <Input
            id="edit-emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="text-center"
            maxLength={2}
          />
        </div>
        <div className="col-span-3 space-y-1">
          <Label htmlFor="edit-name">Category Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};