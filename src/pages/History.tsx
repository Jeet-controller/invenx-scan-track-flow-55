
import { useState } from "react";
import { format } from "date-fns";
import { useInventory } from "../contexts/InventoryContext";
import { Search } from "lucide-react";

export default function History() {
  const { history } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredHistory = searchTerm
    ? history.filter(entry => 
        entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.action.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : history;
  
  // Helper for action colors
  const getActionColor = (action: string) => {
    switch (action) {
      case "add":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      case "update":
        return "bg-purple-100 text-purple-800";
      case "remove":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper for action text
  const getActionText = (action: string, quantity: number) => {
    switch (action) {
      case "add":
        return `Added ${quantity} items`;
      case "sold":
        return `Sold ${quantity} items`;
      case "damaged":
        return `Marked ${quantity} as damaged`;
      case "update":
        return quantity >= 0 
          ? `Updated inventory (+${quantity})` 
          : `Updated inventory (${quantity})`;
      case "remove":
        return "Removed from inventory";
      default:
        return action;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">History</h1>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-invenx-blue"
        />
      </div>
      
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map(entry => (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{entry.productName}</h3>
                  <p className="text-gray-600 text-sm">
                    {getActionText(entry.action, entry.quantity)}
                  </p>
                </div>
                
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getActionColor(entry.action)}`}>
                    {entry.action}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    {format(new Date(entry.timestamp), "MMM d, yyyy • h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">
            {searchTerm ? "No history entries found matching your search." : "No history entries yet."}
          </p>
        </div>
      )}
    </div>
  );
}
