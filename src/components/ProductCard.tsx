
import { Minus, MoreVertical, Plus, BellRing } from "lucide-react";
import { useInventory, Product } from "../contexts/InventoryContext";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { incrementValue, decrementValue, updateProduct, deleteProduct } = useInventory();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMode, setEditMode] = useState<{
    soldIn: boolean;
    soldOut: boolean;
    damaged: boolean;
    lowStockLimit: boolean;
  }>({
    soldIn: false,
    soldOut: false,
    damaged: false,
    lowStockLimit: false
  });

  // Determine if stock is low
  const isLowStock = product.available <= product.lowStockLimit && product.available >= 0;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteProduct(product.id);
      toast({
        title: "Product deleted",
        description: `${product.name} has been removed from inventory`
      });
      setIsDeleting(false);
    }, 500);
  };

  const handleValueChange = (field: "soldIn" | "soldOut" | "damaged" | "lowStockLimit", value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateProduct(product.id, { [field]: numValue });
    }
  };

  const toggleEditMode = (field: "soldIn" | "soldOut" | "damaged" | "lowStockLimit") => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden mb-4 ${isLowStock ? 'border-l-4 border-amber-500' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white border shadow-md rounded-md p-1 z-50">
              <DropdownMenuItem 
                className="text-red-500 cursor-pointer px-3 py-2 hover:bg-red-50 rounded"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Sold In:</span>
            <div className="flex items-center">
              <button 
                onClick={() => decrementValue(product.id, "soldIn")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
                disabled={product.soldIn <= 0}
              >
                <Minus size={16} className={product.soldIn <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              {editMode.soldIn ? (
                <Input
                  type="number"
                  value={product.soldIn}
                  onChange={(e) => handleValueChange("soldIn", e.target.value)}
                  onBlur={() => toggleEditMode("soldIn")}
                  autoFocus
                  className="mx-2 w-24 text-center"
                  min="0"
                />
              ) : (
                <span 
                  className="mx-4 w-24 text-center cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => toggleEditMode("soldIn")}
                >
                  {product.soldIn}
                </span>
              )}
              
              <button 
                onClick={() => incrementValue(product.id, "soldIn")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Sold Out:</span>
            <div className="flex items-center">
              <button 
                onClick={() => decrementValue(product.id, "soldOut")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
                disabled={product.soldOut <= 0}
              >
                <Minus size={16} className={product.soldOut <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              {editMode.soldOut ? (
                <Input
                  type="number"
                  value={product.soldOut}
                  onChange={(e) => handleValueChange("soldOut", e.target.value)}
                  onBlur={() => toggleEditMode("soldOut")}
                  autoFocus
                  className="mx-2 w-24 text-center"
                  min="0"
                />
              ) : (
                <span 
                  className="mx-4 w-24 text-center cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => toggleEditMode("soldOut")}
                >
                  {product.soldOut}
                </span>
              )}
              
              <button 
                onClick={() => incrementValue(product.id, "soldOut")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Damaged:</span>
            <div className="flex items-center">
              <button 
                onClick={() => decrementValue(product.id, "damaged")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
                disabled={product.damaged <= 0}
              >
                <Minus size={16} className={product.damaged <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              {editMode.damaged ? (
                <Input
                  type="number"
                  value={product.damaged}
                  onChange={(e) => handleValueChange("damaged", e.target.value)}
                  onBlur={() => toggleEditMode("damaged")}
                  autoFocus
                  className="mx-2 w-24 text-center"
                  min="0"
                />
              ) : (
                <span 
                  className="mx-4 w-24 text-center cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => toggleEditMode("damaged")}
                >
                  {product.damaged}
                </span>
              )}
              
              <button 
                onClick={() => incrementValue(product.id, "damaged")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:scale-95 transition-transform"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Low Stock Alert Limit:</span>
            <div className="flex items-center">
              {editMode.lowStockLimit ? (
                <Input
                  type="number"
                  value={product.lowStockLimit}
                  onChange={(e) => handleValueChange("lowStockLimit", e.target.value)}
                  onBlur={() => toggleEditMode("lowStockLimit")}
                  autoFocus
                  className="mx-2 w-24 text-center"
                  min="0"
                />
              ) : (
                <span 
                  className="mx-4 w-24 text-center cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => toggleEditMode("lowStockLimit")}
                >
                  {product.lowStockLimit}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Available:</span>
            <div className="flex items-center gap-2">
              {isLowStock && product.available > 0 && (
                <div className="flex items-center text-amber-500">
                  <BellRing size={16} className="animate-pulse mr-1" />
                  <span className="text-sm">Low Stock</span>
                </div>
              )}
              <span className={`font-bold text-xl ${product.available < 0 ? 'text-negative' : product.available <= product.lowStockLimit && product.available >= 0 ? 'text-amber-500' : 'text-green-600'}`}>
                {product.available}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
