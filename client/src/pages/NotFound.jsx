import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/button';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-9xl font-bold text-islamic-primary">404</h1>
          <h2 className="text-2xl font-semibold text-islamic-text mt-4 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-islamic-primary hover:bg-islamic-secondary">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;