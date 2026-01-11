import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';  
import { Button } from '@components/ui/button';    
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Spinner } from '@components/ui/spinner';
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, DollarSign, Users, Edit, Trash2, Plus, Menu, X } from 'lucide-react';
import adminService from '@/services/Admin.service';
import authService from '@/services/Auth.service';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    totalDonors: 0,
    totalUsers: 0,
    recentPayments: []
  });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // User form state
  const [userForm, setUserForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    sex: '',
    educationalStatus: '',
    profession: '',
    country: '',
    region: '',
    zone: '',
    city: '',
    donationAmount: '',
    roleId: 2,
    profilePhoto: null
  });

  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      const data = response?.data || response;
      setDashboardData({
        totalDonations: data?.totalDonations || 0,
        totalDonors: data?.totalDonors || 0,
        totalUsers: data?.totalUsers || 0,
        recentPayments: Array.isArray(data?.recentPayments) ? data.recentPayments : []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllUsers();
      const usersData = response?.data || response;
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'password'];
      for (const field of requiredFields) {
        if (!userForm[field]) {
          toast({
            title: "Error",
            description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
            variant: "destructive",
            duration: 5000,
          });
          setIsLoading(false);
          return;
        }
      }

      // Validate password length
      if (userForm.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters",
          variant: "destructive",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      Object.keys(userForm).forEach(key => {
        if (userForm[key] !== null && userForm[key] !== undefined && userForm[key] !== '') {
          formData.append(key, userForm[key]);
        }
      });

      const response = await authService.register(formData);
      
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
        duration: 5000,
      });
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || 
                   error.response?.data?.message || 
                   "Failed to create user",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.updateUser(currentUser.id, userForm);
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
        duration: 5000,
      });
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await adminService.deleteUser(userToDelete.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
        duration: 5000,
      });
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setUserForm({
      firstName: user.firstName,
      middleName: user.middleName || '',
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      age: user.age || '',
      sex: user.sex || '',
      educationalStatus: user.educationalStatus || '',
      profession: user.profession || '',
      country: user.country || '',
      region: user.region || '',
      zone: user.zone || '',
      city: user.city || '',
      donationAmount: user.donationAmount || '',
      roleId: user.roleId || 2,
      password: ''
    });
    setShowUserModal(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setUserForm({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      sex: '',
      educationalStatus: '',
      profession: '',
      country: '',
      region: '',
      zone: '',
      city: '',
      donationAmount: '',
      roleId: 2,
      profilePhoto: null
    });
    setShowUserModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setUserForm(prev => ({
      ...prev,
      profilePhoto: e.target.files[0]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'dashboard') {
      fetchDashboardData();
    }
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          variant="outline"
          size="icon"
          className="bg-white shadow-md"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static z-30 w-64 bg-islamic-dark text-white transition-all duration-300 ease-in-out ${mobileSidebarOpen ? 'left-0' : '-left-64'} lg:left-0 h-full`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-300 mt-1">At-Taawun Charity</p>
        </div>
        
        <div className="mt-6">
          <div 
            className={`px-6 py-3 ${activeTab === 'dashboard' ? 'bg-islamic-primary/20 border-l-4 border-islamic-primary' : 'hover:bg-islamic-primary/10'} flex items-center cursor-pointer`}
            onClick={() => handleTabChange('dashboard')}
          >
            <DollarSign size={20} className="mr-2" />
            <span>Dashboard</span>
          </div>
          
          <div 
            className={`px-6 py-3 ${activeTab === 'users' ? 'bg-islamic-primary/20 border-l-4 border-islamic-primary' : 'hover:bg-islamic-primary/10'} flex items-center cursor-pointer`}
            onClick={() => handleTabChange('users')}
          >
            <Users size={20} className="mr-2" />
            <span>Users</span>
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-islamic-dark-light">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-islamic-primary/20 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="ml-2">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            onClick={logout} 
            variant="outline" 
            className="w-full text-white border-white/20 hover:bg-white/10"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto ml-0 lg:ml-64">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : 'User Management'}
            </h1>
            <div className="flex flex-wrap gap-2">
              {activeTab === 'users' && (
                <Button
                  onClick={openCreateModal}
                  className="bg-islamic-primary hover:bg-islamic-primary/90 w-full md:w-auto"
                >
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              )}
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-islamic-primary text-islamic-primary hover:bg-islamic-light w-full md:w-auto"
              >
                View Home Page
              </Button>
            </div>
          </div>
          
          {activeTab === 'dashboard' ? (
            <div className="grid gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Donations
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(dashboardData.totalDonations)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      All-time donations received
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Donors
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.totalDonors}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Unique donors
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <User className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardData.totalUsers}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Registered users
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Payments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>
                    Latest {dashboardData.recentPayments.length} transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentPayments.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      No recent payments found
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-x-auto">
                      <div className="min-w-[600px] md:w-full">
                        <table className="w-full caption-bottom text-sm">
                          <thead className="border-b">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">Donor</th>
                              <th className="px-4 py-3 text-left font-medium">Amount</th>
                              <th className="px-4 py-3 text-left font-medium">Date</th>
                              <th className="px-4 py-3 text-left font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.recentPayments.map((payment) => (
                              <tr key={payment.id || payment._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  {payment.donorName || 'Anonymous'}
                                </td>
                                <td className="px-4 py-3">
                                  {formatCurrency(payment.amount)}
                                </td>
                                <td className="px-4 py-3">
                                  {formatDate(payment.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : payment.status === 'failed' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  All registered users in the system ({users.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <div className="min-w-[600px] md:w-full">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Role</th>
                            <th className="px-4 py-3 text-left font-medium">Joined</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id || user._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                              </td>
                              <td className="px-4 py-3">
                                {user.email}
                              </td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {user.roleName || 'User'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(user)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDeleteModal(user)}
                                  >
                                    <Trash2 size={16} className="text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {currentUser ? 'Edit User' : 'Create User'}
              </h2>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userForm.firstName}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={userForm.middleName}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userForm.lastName}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                      required
                      disabled={!!currentUser}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                </div>

                {!currentUser && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                      <input
                        type="password"
                        name="password"
                        value={userForm.password}
                        onChange={handleFormChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Details Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={userForm.age}
                      onChange={handleFormChange}
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="sex"
                      value={userForm.sex}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Education & Profession Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Education & Profession</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Status</label>
                    <select
                      name="educationalStatus"
                      value={userForm.educationalStatus}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    >
                      <option value="">Select Education</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <input
                      type="text"
                      name="profession"
                      value={userForm.profession}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Location Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={userForm.country}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <input
                      type="text"
                      name="region"
                      value={userForm.region}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                    <input
                      type="text"
                      name="zone"
                      value={userForm.zone}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={userForm.city}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Donation & Role Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Donation & Role</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
                    <input
                      type="number"
                      name="donationAmount"
                      value={userForm.donationAmount}
                      onChange={handleFormChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      name="roleId"
                      value={userForm.roleId}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                    >
                      <option value={2}>User</option>
                      <option value={1}>Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 border-b pb-2">Profile Photo</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-islamic-primary/10 file:text-islamic-primary
                      hover:file:bg-islamic-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={currentUser ? handleUpdateUser : handleCreateUser}
                disabled={isLoading}
                className="bg-islamic-primary hover:bg-islamic-primary/90"
              >
                {isLoading ? <Spinner size="sm" /> : currentUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete user <span className="font-semibold">{userToDelete?.firstName} {userToDelete?.lastName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUser}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? <Spinner size="sm" /> : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;