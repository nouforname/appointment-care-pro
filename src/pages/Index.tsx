
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Ambulance, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health, <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Book appointments with top doctors, access emergency services, and manage your healthcare journey all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/doctors">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <User className="w-5 h-5 mr-2" />
                Patient Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Booking</CardTitle>
              <CardDescription>
                Schedule appointments with verified doctors in just a few clicks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/doctors">
                <Button variant="outline" className="w-full">Find Doctors</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Ambulance className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Emergency Services</CardTitle>
              <CardDescription>
                24/7 emergency support when you need it most
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="destructive" className="w-full">
                Call Emergency
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Track History</CardTitle>
              <CardDescription>
                Keep track of all your appointments and medical history
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/profile">
                <Button variant="outline" className="w-full">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Specialties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
