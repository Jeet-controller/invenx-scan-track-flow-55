
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  barcode: string;
  soldIn: number;
  soldOut: number;
  damaged: number;
  available: number;
  category: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  productId: string;
  productName: string;
  action: "add" | "remove" | "update" | "sold" | "damaged";
  quantity: number;
  timestamp: string;
  user: string;
}

interface InventoryContextType {
  products: Product[];
  history: HistoryEntry[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "available" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  incrementValue: (id: string, field: "soldIn" | "soldOut" | "damaged") => void;
  decrementValue: (id: string, field: "soldIn" | "soldOut" | "damaged") => void;
  findProductByBarcode: (barcode: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Sample data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wine",
    barcode: "7891234567890",
    soldIn: 312575,
    soldOut: 32,
    damaged: 19467694,
    available: -19155151,
    category: "Alcohol",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Beer",
    barcode: "7891234567891",
    soldIn: 500,
    soldOut: 200,
    damaged: 10,
    available: 290,
    category: "Alcohol",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Whiskey",
    barcode: "7891234567892",
    soldIn: 150,
    soldOut: 75,
    damaged: 5,
    available: 70,
    category: "Alcohol",
    createdAt: new Date().toISOString()
  }
];

// Sample history data
const generateHistory = (products: Product[]): HistoryEntry[] => {
  const history: HistoryEntry[] = [];
  
  products.forEach(product => {
    // Create some history entries for each product
    const actions: ("add" | "remove" | "update" | "sold" | "damaged")[] = ["add", "sold", "damaged"];
    
    actions.forEach((action, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      
      history.push({
        id: `${product.id}-${index}`,
        productId: product.id,
        productName: product.name,
        action,
        quantity: Math.floor(Math.random() * 10) + 1,
        timestamp: date.toISOString(),
        user: "Admin"
      });
    });
  });
  
  // Sort by timestamp, newest first
  return history.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedProducts = localStorage.getItem("invenx_products");
    const storedHistory = localStorage.getItem("invenx_history");
    
    if (storedProducts && storedHistory) {
      setProducts(JSON.parse(storedProducts));
      setHistory(JSON.parse(storedHistory));
    } else {
      // Use sample data
      setProducts(sampleProducts);
      setHistory(generateHistory(sampleProducts));
    }
    
    setLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("invenx_products", JSON.stringify(products));
      localStorage.setItem("invenx_history", JSON.stringify(history));
    }
  }, [products, history, loading]);

  const addHistoryEntry = (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setHistory(prev => [newEntry, ...prev]);
  };

  const addProduct = (product: Omit<Product, "id" | "available" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      available: product.soldIn - product.soldOut - product.damaged,
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    addHistoryEntry({
      productId: newProduct.id,
      productName: newProduct.name,
      action: "add",
      quantity: newProduct.soldIn,
      user: "Admin"
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product, ...updates };
          // Recalculate available
          updatedProduct.available = updatedProduct.soldIn - updatedProduct.soldOut - updatedProduct.damaged;
          return updatedProduct;
        }
        return product;
      })
    );
    
    addHistoryEntry({
      productId: id,
      productName: products.find(p => p.id === id)?.name || "Unknown Product",
      action: "update",
      quantity: 1,
      user: "Admin"
    });
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    
    if (product) {
      setProducts(prev => prev.filter(p => p.id !== id));
      
      addHistoryEntry({
        productId: id,
        productName: product.name,
        action: "remove",
        quantity: 1,
        user: "Admin"
      });
    }
  };

  const incrementValue = (id: string, field: "soldIn" | "soldOut" | "damaged") => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          const updatedProduct = { 
            ...product, 
            [field]: product[field] + 1 
          };
          
          // Recalculate available
          updatedProduct.available = updatedProduct.soldIn - updatedProduct.soldOut - updatedProduct.damaged;
          
          return updatedProduct;
        }
        return product;
      })
    );
    
    // Add history entry
    const action = field === "soldOut" ? "sold" : field === "damaged" ? "damaged" : "add";
    
    addHistoryEntry({
      productId: id,
      productName: products.find(p => p.id === id)?.name || "Unknown Product",
      action,
      quantity: 1,
      user: "Admin"
    });
  };

  const decrementValue = (id: string, field: "soldIn" | "soldOut" | "damaged") => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === id && product[field] > 0) {
          const updatedProduct = { 
            ...product, 
            [field]: product[field] - 1 
          };
          
          // Recalculate available
          updatedProduct.available = updatedProduct.soldIn - updatedProduct.soldOut - updatedProduct.damaged;
          
          return updatedProduct;
        }
        return product;
      })
    );
    
    // Add history entry for decrement
    addHistoryEntry({
      productId: id,
      productName: products.find(p => p.id === id)?.name || "Unknown Product",
      action: "update",
      quantity: -1,
      user: "Admin"
    });
  };

  const findProductByBarcode = (barcode: string) => {
    return products.find(product => product.barcode === barcode);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        history,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        incrementValue,
        decrementValue,
        findProductByBarcode
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
