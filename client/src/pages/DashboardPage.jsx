import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useAuth } from '@contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import paymentService from '@services/paymentService';
import userService from '@services/user.service';
import { Spinner } from '@components/ui/spinner';
import { User, CreditCard, DollarSign } from 'lucide-react';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [platformTotal, setPlatformTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePhoto: null
  });

  useEffect(() => {
    fetchDashboardData();
    // Initialize form data when user loads
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        profilePhoto: null
      });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [historyResponse, platformResponse] = await Promise.all([
        paymentService.getUserPayments(),
        paymentService.getAllPayments()
      ]);
      
      const userPayments = Array.isArray(historyResponse?.data) ? historyResponse.data : [];
      const allPayments = Array.isArray(platformResponse?.data) ? platformResponse.data : [];
      
      setPaymentHistory(userPayments);
      calculateUserTotal(userPayments);
      calculatePlatformTotal(allPayments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUserTotal = (payments) => {
    const validPayments = Array.isArray(payments) ? payments : [];
    const total = validPayments
      .filter(p => p?.status === 'completed')
      .reduce((sum, payment) => sum + (parseFloat(payment?.amount) || 0), 0);
    setTotalDonated(total);
  };

  const calculatePlatformTotal = (payments) => {
    const validPayments = Array.isArray(payments) ? payments : [];
    const total = validPayments
      .filter(p => p?.status === 'completed')
      .reduce((sum, payment) => sum + (parseFloat(payment?.amount) || 0), 0);
    setPlatformTotal(total);
  };

  const handleEditProfile = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePhoto: null
    });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

const handleSaveProfile = async () => {
  setProfileLoading(true);
  try {
    const updatedUser = await userService.updateUserProfile(formData);
    
    updateUser({
      ...updatedUser.data,
      profilePhotoPath: updatedUser.data.profilePhotoPath 
        ? `${updatedUser.data.profilePhotoPath}?${Date.now()}`
        : null
    });

    toast({
      title: 'Success',
      description: 'Profile updated successfully',
      variant: 'default', // This ensures the success styling
      // You can also add duration if needed
      duration: 3000,
    });
    
    setEditMode(false);
  } catch (error) {
    console.error('Update error:', error);
    toast({
      title: 'Error',
      description: error.response?.data?.message || error.message || 'Failed to update profile',
      variant: 'destructive',
    });
  } finally {
    setProfileLoading(false);
  }
};

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="bg-islamic-light py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-islamic-primary">Donor Dashboard</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - User Profile */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Profile</CardTitle>
                  {!editMode ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-islamic-primary hover:text-islamic-secondary"
                      onClick={handleEditProfile}
                    >
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-800"
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                      >
                        {profileLoading ? <Spinner size="sm" className="mr-2" /> : null}
                        {profileLoading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-islamic-primary/20 flex items-center justify-center mb-3">
                    {user?.profilePhotoPath ? (
                      <img 
                        src={`${user.profilePhotoPath}`}
                        alt={user.firstName} 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.className = 'hidden';
                        }}
                      />
                    ) : (
                      <User size={40} className="text-islamic-primary" />
                    )}
                  </div>
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mb-2 p-2 border rounded w-full"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mb-2 p-2 border rounded w-full"
                        placeholder="Last Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mb-2 p-2 border rounded w-full"
                        placeholder="Email"
                      />
                      <input
                        type="file"
                        name="profilePhoto"
                        onChange={handleInputChange}
                        className="mb-2 w-full"
                        accept="image/*"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Donated:</span>
                    <span className="font-medium">${totalDonated.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link to="/payment">
                    <Button className="w-full bg-islamic-primary hover:bg-islamic-secondary">
                      <DollarSign size={18} className="mr-2" />
                      Make a Donation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-islamic-text hover:text-islamic-primary"
                    onClick={handleEditProfile}
                  >
                    Update Profile
                  </Button>
                  <Link to="/payment/history">
                    <Button variant="ghost" className="w-full justify-start text-islamic-text hover:text-islamic-primary">
                      Payment History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Contributions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Total Contributions</CardTitle>
                <CardDescription>Overview of total contributions made across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <div className="bg-islamic-primary/10 p-2 rounded-full mr-3">
                    <CreditCard size={20} className="text-islamic-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Contributed by All Users</p>
                    <p className="text-2xl font-bold text-islamic-primary">${platformTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Record of your donations</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-islamic-primary border-islamic-primary hover:bg-islamic-light"
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : paymentHistory.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment) => (
                            <tr key={payment.id} className="border-t border-gray-200">
                              <td className="px-4 py-3 text-islamic-text">
                                {formatDate(payment.paymentDate)}
                              </td>
                              <td className="px-4 py-3 font-medium text-islamic-text">
                                ${parseFloat(payment.amount).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No payment history available</p>
                    <Link to="/payment">
                      <Button className="bg-islamic-primary hover:bg-islamic-secondary">
                        Make Your First Donation
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;