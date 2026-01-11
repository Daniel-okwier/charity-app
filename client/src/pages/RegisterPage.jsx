import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { useAuth } from '@contexts/AuthContext';
import { Separator } from '@components/ui/separator';
import { Spinner } from '@components/ui/spinner';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
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
    donationAmount: 100,
    profilePhoto: null,
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, profilePhoto: file });
  };
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (currentStep === 3) {
      if (!formData.sex) newErrors.sex = 'Gender is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    await register(formData);
  };

  const renderPersonalInfoStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-islamic-primary">Personal Information</CardTitle>
        <CardDescription>Please fill in your personal details below</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            <p className="text-sm text-gray-500">Password must be at least 6 characters</p>
          </div>
          
          <div className="pt-4">
            <Button 
              type="button" 
              onClick={nextStep}
              className="w-full md:w-auto bg-islamic-primary hover:bg-islamic-secondary"
            >
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
  
  const renderContactLocationStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-islamic-primary">Contact & Location</CardTitle>
        <CardDescription>Please provide your contact details and location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Input
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              onClick={prevStep}
              variant="outline" 
              className="border-islamic-primary text-islamic-primary hover:bg-islamic-light"
            >
              Previous Step
            </Button>
            <Button 
              type="button" 
              onClick={nextStep}
              className="bg-islamic-primary hover:bg-islamic-secondary"
            >
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
  
  const renderOtherDetailsStep = () => (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-islamic-primary">Other Details</CardTitle>
        <CardDescription>
          Please provide additional information and set your monthly donation amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gender *</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Input
                    type="radio"
                    id="male"
                    name="sex"
                    value="male"
                    checked={formData.sex === 'male'}
                    onChange={handleRadioChange}
                    className="mr-2 h-4 w-4 text-islamic-primary focus:ring-islamic-primary"
                  />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center">
                  <Input
                    type="radio"
                    id="female"
                    name="sex"
                    value="female"
                    checked={formData.sex === 'female'}
                    onChange={handleRadioChange}
                    className="mr-2 h-4 w-4 text-islamic-primary focus:ring-islamic-primary"
                  />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
              </div>
              {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="educationalStatus">Educational Status</Label>
              <Input
                id="educationalStatus"
                name="educationalStatus"
                value={formData.educationalStatus}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-2">
            <Label htmlFor="donationAmount">Monthly Donation Amount *</Label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">$</span>
              <Input
                id="donationAmount"
                name="donationAmount"
                type="number"
                min="5"
                value={formData.donationAmount}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-gray-500">
              Choose the amount you wish to donate monthly. 
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <Input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Optional: Upload a profile photo (JPG,JPEG,PNG, or GIF, max 5MB)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="button" 
              onClick={prevStep}
              variant="outline" 
              className="border-islamic-primary text-islamic-primary hover:bg-islamic-light"
            >
              Previous Step
            </Button>
            <Button 
              type="submit"
              className="bg-islamic-primary hover:bg-islamic-secondary"
              disabled={isLoading}
            >
              {isLoading ? <><Spinner size="sm" className="mr-2" /> Registering...</> : 'Complete Registration'}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );

  return (
    <MainLayout>
      <section className="py-12 bg-islamic-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-islamic-primary mb-10">
              Join At-Taawun as a Donor
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-islamic-primary/10 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-1 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-islamic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${step > 1 ? 'bg-islamic-primary' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className="flex flex-1 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-islamic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                      2
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${step > 2 ? 'bg-islamic-primary' : 'bg-gray-200'}`}></div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-islamic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                      3
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm">
                  <span className={step === 1 ? 'font-bold text-islamic-primary' : 'text-gray-500'}>Personal Info</span>
                  <span className={step === 2 ? 'font-bold text-islamic-primary' : 'text-gray-500'}>Contact & Location</span>
                  <span className={step === 3 ? 'font-bold text-islamic-primary' : 'text-gray-500'}>Other Details</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {step === 1 && renderPersonalInfoStep()}
                {step === 2 && renderContactLocationStep()}
                {step === 3 && renderOtherDetailsStep()}
              </form>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account? {' '}
                <Link to="/login" className="text-islamic-primary hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegisterPage;