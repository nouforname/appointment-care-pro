
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Calendar, Ambulance } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

const Navbar = () => {
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [showEmergency, setShowEmergency] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEmergencyCall = () => {
    setShowEmergency(true);
    // Simulate emergency call
    setTimeout(() => {
      setShowEmergency(false);
      alert('Emergency services have been contacted. Help is on the way!');
    }, 2000);
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                MediCare
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/doctors" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Doctors
              </Link>
              
              {user && (
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Profile
                </Link>
              )}

              <Button
                onClick={handleEmergencyCall}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Ambulance className="w-4 h-4 mr-2" />
                Emergency
              </Button>

              {user || admin ? (
                <div className="flex items-center space-x-4">
                  {user && (
                    <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  )}
                  {admin && (
                    <Link to="/admin" className="text-blue-600 hover:text-blue-700 transition-colors">
                      Dashboard
                    </Link>
                  )}
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/admin-login">
                    <Button variant="ghost" size="sm" className="text-xs">Admin</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={handleEmergencyCall}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Ambulance className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden bg-gray-50 px-4 py-2 space-y-2">
          <Link to="/doctors" className="block text-gray-700 hover:text-blue-600">
            Find Doctors
          </Link>
          {user && (
            <Link to="/profile" className="block text-gray-700 hover:text-blue-600">
              Profile
            </Link>
          )}
          {!user && !admin && (
            <div className="space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link to="/admin-login" className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs">Admin Login</Button>
              </Link>
            </div>
          )}
          {(user || admin) && (
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
              Logout
            </Button>
          )}
        </div>
      </nav>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm mx-4 text-center animate-pulse">
            <Ambulance className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calling Emergency Services</h3>
            <p className="text-gray-600">Please hold on...</p>
          </Card>
        </div>
      )}
    </>
  );
};

export default Navbar;
