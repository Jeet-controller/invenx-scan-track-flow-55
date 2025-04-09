
import { Link, useLocation } from "react-router-dom";
import { Box, Clock, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
      <div className="container mx-auto">
        <div className="flex justify-around items-center py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-invenx-blue' : 'text-gray-500'}`}
          >
            <Box size={24} />
            <span className="text-xs mt-1">Inventory</span>
          </Link>
          
          <Link 
            to="/history" 
            className={`flex flex-col items-center p-2 ${isActive('/history') ? 'text-invenx-blue' : 'text-gray-500'}`}
          >
            <Clock size={24} />
            <span className="text-xs mt-1">History</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-invenx-blue' : 'text-gray-500'}`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
