/**
 * LogoutButton Component
 * 
 * This is a reusable logout button component that handles user logout functionality.
 * It dispatches the logout action to Redux and navigates the user to the login page.
 * 
 * Features:
 * - Handles logout API call
 * - Clears authentication state
 * - Redirects to login page
 * - Customizable styling and text
 * - Error handling for failed logout attempts
 * 
 * Usage:
 * <LogoutButton className="btn btn-danger">Sign Out</LogoutButton>
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store';
import { logoutUser } from '../store/slices/authSlice';

/**
 * Props interface for LogoutButton component
 */
interface LogoutButtonProps {
  className?: string;           // CSS classes for styling the button
  children?: React.ReactNode;   // Button text/content (default: "Logout")
}

/**
 * LogoutButton component that handles user logout
 * 
 * @param className - Optional CSS classes for button styling
 * @param children - Optional button content (defaults to "Logout")
 * @returns A button element that handles logout functionality
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "btn btn-outline-danger",  // Default styling
  children = "Logout"                    // Default button text
}) => {
  // Redux hook for dispatching actions
  const dispatch = useDispatch<AppDispatch>();
  
  // React Router hook for navigation
  const navigate = useNavigate();

  /**
   * Handle logout button click
   * This function is called when the user clicks the logout button
   */
  const handleLogout = async () => {
    try {
      // Dispatch the logout action and wait for it to complete
      // This will call the logout API and clear the authentication state
      await dispatch(logoutUser()).unwrap();
      
      // After successful logout, navigate to login page
      navigate('/login');
    } catch (error) {
      // If logout API call fails, still log the user out locally
      // This ensures users can always logout even if the server is down
      console.error('Logout failed:', error);
      
      // Navigate to login page even if API call failed
      navigate('/login');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <button 
      type="button" 
      className={className}
      onClick={handleLogout}
    >
      {children}
    </button>
  );
};

export default LogoutButton; 