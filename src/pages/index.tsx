import React, { useEffect, useState } from 'react';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import ProfileCard from '@/components/ProfileCard';
import UserAvatar from '@/components/UserAvatar';

export interface UserDetails {
  userId : string,
  activity: {
    lastLogin: string,
    loginCount: number,
    accountCreated: string,
    lastUpdated: string
  },
  social: {
    connections: number,
    followers: number,
    following: number,
    posts: number
  },
  analytics: {
    pageViews: number,
    uniqueVisitors: number,
    bounceRate: number,
    averageTimeOnSite: string
  }
}
export interface User {
  gender: string,
  name: {
    title: string,
    first: string,
    last: string
  },
  location: {
    street: {
      number: number,
      name: string
    },
    city: string,
    country: string,
    postcode: string,
    coordinates: {
      latitude: string,
      longitude: string
    }
  },
  email: string,
  dob: {
    date: string  ,
    age: number
  },
  registered: {
    date: string,
    age: number 
  },
  phone: string,
  cell: string,
  id: string,
  picture: string,
  nat: string
}

export default function Home() {
  // State management for users and loading state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // State to manage which user card is active (clicked) and the current cursor position
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // State to show more user details data
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(false)

  // Fetch more data related to the user card displayed
  useEffect(() => {
    const fetchUserDetails = async (user: User) => {
      if (selectedIndex === null) {
        setUserDetails(null);
        return;
      }
      setIsUserDetailsLoading(true);
      setUserDetailsError(false);
      const response = await fetch(`https://mockusergenerator.onrender.com/api/users/${user.id}/details`);
      if (!response.ok) {
        console.error('Failed to fetch user details');
        setUserDetailsError(true);  
        setIsUserDetailsLoading(false);
        return;
      }
      const data = await response.json();
      setUserDetails(data);
      setIsUserDetailsLoading(false);
    };

    fetchUserDetails(users[selectedIndex!]);
  }, [selectedIndex, users]);

  useEffect(() => {
    // Fetch user data
    setLoading(true); // Ensure loading state is true initially
    fetch('https://mockusergenerator.onrender.com/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  // Hide tooltip when clicking anywhere outside cards
  useEffect(() => {
    const handleDocClick = () => setSelectedIndex(null);
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  if (loading) {
    // Show loading placeholder while fetching data
    return (
      <div className="container py-4">
        <LoadingPlaceholder className="mt-2" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1>Loaded Users</h1>
      <div className="row g-4">
        {users.map((user, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div
              className="d-flex align-items-center gap-3 border border-secondary p-3 rounded-4 entry-hover"
              // handling clicks that activate the card
              onClick={(e) => {
                // Prevent document click handler from closing the tooltip
                e.stopPropagation();
                // Always activate this card and update position
                setSelectedIndex(index);
                // Store document-relative coordinates so tooltip scrolls with page
                setCursorPos({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
              }}
            >
              <UserAvatar
                src = {user.picture}
                alt = {`${user.name.first} ${user.name.last}`}
                size = {48}
                circular = {true}
              />
              <p className="mb-0">{`${user.name.first} ${user.name.last}`}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating placeholder that appears above the cursor when hovering a card */}
      {selectedIndex !== null && (
        <div
          className="click-tooltip"
          style={{
            top: Math.max(cursorPos.y - 20, 0),
            left: cursorPos.x,
          }}
        >
          <ProfileCard user={users[selectedIndex]} userDetails={userDetails} isUserDetailsLoading={isUserDetailsLoading} userDetailsError={userDetailsError} />
        </div>
      )}
    </div>
  );
}