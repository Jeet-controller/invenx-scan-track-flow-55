
import { Minus, MoreVertical, Plus } from "lucide-react";
import { useInventory, Product } from "../contexts/InventoryContext";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { incrementValue, decrementValue, deleteProduct } = useInventory();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
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
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                disabled={product.soldIn <= 0}
              >
                <Minus size={16} className={product.soldIn <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              <span className="mx-4 w-24 text-center">{product.soldIn}</span>
              
              <button 
                onClick={() => incrementValue(product.id, "soldIn")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
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
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                disabled={product.soldOut <= 0}
              >
                <Minus size={16} className={product.soldOut <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              <span className="mx-4 w-24 text-center">{product.soldOut}</span>
              
              <button 
                onClick={() => incrementValue(product.id, "soldOut")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
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
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                disabled={product.damaged <= 0}
              >
                <Minus size={16} className={product.damaged <= 0 ? "text-gray-400" : "text-gray-600"} />
              </button>
              
              <span className="mx-4 w-24 text-center">{product.damaged}</span>
              
              <button 
                onClick={() => incrementValue(product.id, "damaged")}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Available:</span>
            <span className={`font-bold text-xl ${product.available < 0 ? 'text-negative' : 'text-green-600'}`}>
              {product.available}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
