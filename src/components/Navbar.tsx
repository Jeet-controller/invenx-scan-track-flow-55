
import { Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invenx</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 flex items-center">
            <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-1">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
