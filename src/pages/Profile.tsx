
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Settings, LogOut, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-invenx-blue rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="divide-y">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <Settings size={20} className="text-gray-500 mr-3" />
              <span>Settings</span>
            </div>
            <ArrowRight size={18} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center">
              <HelpCircle size={20} className="text-gray-500 mr-3" />
              <span>Help & Support</span>
            </div>
            <ArrowRight size={18} className="text-gray-400" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-red-500"
          >
            <div className="flex items-center">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </div>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">Invenx v1.0.0</p>
        <p className="text-gray-400 text-xs mt-1">© 2025 Invenx. All rights reserved.</p>
      </div>
    </div>
  );
}
