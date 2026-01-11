import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@contexts/AuthContext';
import paymentService from '@services/paymentService';
import { Spinner } from '@components/ui/spinner';
import { Check, AlertCircle } from 'lucide-react';

const PaymentPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [txRef, setTxRef] = useState('');

  // Helper function to safely get donation amount
  const getDonationAmount = () => {
    const amount = Number(user?.donationAmount);
    return isNaN(amount) ? 100 : amount;
  };
const initializePayment = useCallback(async () => {
  if (!user) {
    navigate('/login');
    return;
  }
  
  setIsLoading(true);
  
  try {
    const response = await paymentService.initializePayment({
      amount: getDonationAmount(),
      email: user.email,
      firstName: user.firstName, 
      lastName: user.lastName   
    });
    
    if (response.status === 'success') {
      setPaymentUrl(response.data.checkoutUrl);
      setTxRef(response.data.txRef);
    } else {
      throw new Error(response.message || 'Failed to initialize payment');
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    toast({
      title: 'Payment Error',
      description: error.message || 'Unable to initialize payment. Please try again later.',
      variant: 'destructive',
      duration: 5000,
    });
  } finally {
    setIsLoading(false);
  }
}, [user, toast, navigate]);

  const verifyPayment = useCallback(async (reference) => {
  if (!reference) return;

  setIsVerifying(true);
  setVerificationComplete(false);

  try {
    const response = await paymentService.verifyPayment(reference);

    setVerificationComplete(true);
    if (response.status === 'success') {
      setVerificationSuccess(true);
      toast({
        title: 'Payment Successful',
        description: 'Your donation has been processed successfully.',
        duration: 5000,
      });

      // Redirect to the dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } else {
      setVerificationSuccess(false);
      toast({
        title: 'Payment Failed',
        description: response.message || 'There was an issue with your payment. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    setVerificationComplete(true);
    setVerificationSuccess(false);
    toast({
      title: 'Verification Error',
      description: error.message || 'Unable to verify your payment. Please contact support.',
      variant: 'destructive',
      duration: 5000,
    });
  } finally {
    setIsVerifying(false);
  }
}, [navigate, toast]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get('tx_ref') || queryParams.get('reference');
    
    if (reference) {
      verifyPayment(reference);
    } else {
      initializePayment();
    }
  }, [location, initializePayment, verifyPayment]);

  const redirectToPayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      toast({
        title: 'Payment Error',
        description: 'Payment URL not available. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderVerificationState = () => {
    if (isVerifying) {
      return (
        <div className="text-center py-12">
          <Spinner size="lg" className="mb-4" />
          <h3 className="text-xl font-medium mb-2">Verifying Your Payment</h3>
          <p className="text-gray-600">Please wait while we confirm your donation...</p>
        </div>
      );
    }
    
    if (verificationComplete) {
      return verificationSuccess ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-green-600">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">Thank you for your generous donation.</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-islamic-primary hover:bg-islamic-secondary"
          >
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-red-600">Payment Failed</h3>
          <p className="text-gray-600 mb-6">There was a problem processing your donation.</p>
          <Button 
            onClick={initializePayment}
            className="bg-islamic-primary hover:bg-islamic-secondary"
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <MainLayout>
      <section className="py-12 bg-islamic-light">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-islamic-primary mb-10">
              Complete Your Donation
            </h1>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Make a Difference Today</CardTitle>
                <CardDescription>
                  Your generous contribution will help support our charitable projects
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isVerifying || verificationComplete ? (
                  renderVerificationState()
                ) : user && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-lg mb-4 text-islamic-primary">Donation Summary</h3>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-gray-600 font-medium">Donor:</div>
                        <div>{user.firstName} {user.lastName}</div>
                        
                        <div className="text-gray-600 font-medium">Email:</div>
                        <div>{user.email}</div>
                        
                        <div className="text-gray-600 font-medium">Amount:</div>
                        <div className="font-semibold text-islamic-primary">
                          ${getDonationAmount().toFixed(2)} ETB
                        </div>
                        
                        <div className="text-gray-600 font-medium">Payment Method:</div>
                        <div>Chapa Payment Gateway</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-6">
                        You will be redirected to the Chapa secure payment gateway to complete your donation.
                        All transactions are encrypted and secure.
                      </p>
                      
                      <Button
                        onClick={redirectToPayment}
                        className="w-full bg-islamic-primary hover:bg-islamic-secondary py-6 text-lg"
                        disabled={isLoading || !paymentUrl}
                      >
                        {isLoading ? (
                          <><Spinner size="sm" className="mr-2" /> Preparing Payment...</>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </Button>
                      
                      <p className="mt-4 text-xs text-gray-500">
                        By proceeding, you agree to our terms and conditions for processing donations.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PaymentPage;