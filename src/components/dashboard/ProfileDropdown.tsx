import { useState, useEffect, useRef } from "react";
import { useNavigate } from "../../lib/hooks/useNavigate";
import { AuthService } from "../../lib/services/auth";
import { ApiClient } from "../../lib/api";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black" // Changed from currentColor to black
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiClientInstance, setApiClientInstance] = useState<ApiClient | null>(null);
  const [authServiceInstance, setAuthServiceInstance] = useState<AuthService | null>(null);

  useEffect(() => {
    const client = new ApiClient();
    const token = localStorage.getItem("token");
    if (token) {
      client.setToken(token);
    }
    setApiClientInstance(client);
    const service = new AuthService(client);
    setAuthServiceInstance(service);
    setIsAuthenticated(service.isAuthenticated());
  }, []);

  const handleLogout = () => {
    if (authServiceInstance) {
      authServiceInstance.logout();
      navigate("/login");
      setIsOpen(false);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <UserIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <button
            onClick={handleProfile}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
          >
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
};
