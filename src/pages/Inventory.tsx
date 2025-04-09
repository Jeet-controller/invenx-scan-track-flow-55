
import { useState } from "react";
import { Plus, Search, Barcode } from "lucide-react";
import { useInventory } from "../contexts/InventoryContext";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import { scanBarcode } from "../utils/barcodeScanner";
import { useToast } from "@/components/ui/use-toast";

export default function Inventory() {
  const { products, findProductByBarcode } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      )
    : products;
  
  const handleScanBarcode = async () => {
    try {
      setIsScanning(true);
      const barcode = await scanBarcode();
      
      // Find product with this barcode
      const product = findProductByBarcode(barcode);
      
      if (product) {
        // Set search term to highlight the product
        setSearchTerm(barcode);
        toast({
          title: "Product found",
          description: `Found: ${product.name}`
        });
      } else {
        toast({
          title: "Product not found",
          description: "No product with this barcode. Would you like to add it?",
          action: (
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="bg-invenx-blue text-white px-3 py-1 rounded-md"
            >
              Add
            </button>
          ),
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-12 h-12 rounded-full bg-invenx-blue text-white flex items-center justify-center shadow-md"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-invenx-blue"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={handleScanBarcode}
            disabled={isScanning}
            className="h-full px-4 rounded-r-md bg-invenx-blue text-white transition-all active:scale-95 hover:bg-blue-600 disabled:bg-blue-300 disabled:text-gray-100 flex items-center gap-2"
            aria-label="Scan Barcode"
          >
            <Barcode size={20} className={isScanning ? "animate-pulse" : ""} />
            <span className="hidden sm:inline">{isScanning ? "Scanning..." : "Scan"}</span>
          </button>
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">
            {searchTerm ? "No products found matching your search." : "No products added yet."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-invenx-blue text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Product
          </button>
        </div>
      )}
      
      <AddProductModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
