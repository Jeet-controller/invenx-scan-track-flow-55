
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import { scanBarcode } from "../utils/barcodeScanner";
import { useToast } from "@/components/ui/use-toast";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({ open, onClose }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [soldIn, setSoldIn] = useState(0);
  const [soldOut, setSoldOut] = useState(0);
  const [damaged, setDamaged] = useState(0);
  const [lowStockLimit, setLowStockLimit] = useState(10); // New state for low stock limit
  const [isScanning, setIsScanning] = useState(false);
  const { addProduct, findProductByBarcode } = useInventory();
  const { toast } = useToast();
  
  const resetForm = () => {
    setName("");
    setBarcode("");
    setSoldIn(0);
    setSoldOut(0);
    setDamaged(0);
    setLowStockLimit(10); // Reset the low stock limit
  };
  
  const handleScanBarcode = async () => {
    try {
      setIsScanning(true);
      const code = await scanBarcode();
      setBarcode(code);
      
      // Check if product with barcode already exists
      const existingProduct = findProductByBarcode(code);
      if (existingProduct) {
        toast({
          title: "Barcode already exists",
          description: `This barcode is used by ${existingProduct.name}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Scan failed",
        description: String(error) || "Could not scan barcode",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !barcode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Check if product with barcode already exists
    const existingProduct = findProductByBarcode(barcode);
    if (existingProduct) {
      toast({
        title: "Barcode already exists",
        description: `This barcode is used by ${existingProduct.name}`,
        variant: "destructive"
      });
      return;
    }
    
    addProduct({
      name,
      barcode,
      soldIn,
      soldOut,
      damaged,
      lowStockLimit, // Add the low stock limit
    });
    
    toast({
      title: "Product added",
      description: `${name} has been added to inventory`
    });
    
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
              Barcode*
            </label>
            <div className="flex">
              <input
                id="barcode"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
                placeholder="Enter barcode"
              />
              <button
                type="button"
                onClick={handleScanBarcode}
                disabled={isScanning}
                className="px-4 py-2 bg-invenx-blue text-white rounded-r-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isScanning ? "Scanning..." : "Scan"}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="lowStockLimit" className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Alert Limit
            </label>
            <input
              id="lowStockLimit"
              type="number"
              min="0"
              value={lowStockLimit}
              onChange={(e) => setLowStockLimit(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
              placeholder="Enter low stock limit"
            />
            <p className="text-sm text-gray-500 mt-1">
              You'll be alerted when available quantity falls below this number
            </p>
          </div>
          
          <div>
            <label htmlFor="soldIn" className="block text-sm font-medium text-gray-700 mb-1">
              Sold In
            </label>
            <input
              id="soldIn"
              type="number"
              min="0"
              value={soldIn}
              onChange={(e) => setSoldIn(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
            />
          </div>
          
          <div>
            <label htmlFor="soldOut" className="block text-sm font-medium text-gray-700 mb-1">
              Sold Out
            </label>
            <input
              id="soldOut"
              type="number"
              min="0"
              value={soldOut}
              onChange={(e) => setSoldOut(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
            />
          </div>
          
          <div>
            <label htmlFor="damaged" className="block text-sm font-medium text-gray-700 mb-1">
              Damaged
            </label>
            <input
              id="damaged"
              type="number"
              min="0"
              value={damaged}
              onChange={(e) => setDamaged(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-invenx-blue"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-invenx-blue hover:bg-blue-600"
            >
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
