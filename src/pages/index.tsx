import React, { useEffect, useState } from 'react';
import LoadingPlaceholder from '../components/LoadingPlaceholder';

interface User {
  name: {
    first: string;
    last: string;
  };
  picture: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // State to manage which user card is active (clicked) and the current cursor position
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
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
              onClick={(e) => {
                // Prevent document click handler from closing the tooltip
                e.stopPropagation();
                // Always activate this card and update position
                setSelectedIndex(index);
                // Store document-relative coordinates so tooltip scrolls with page
                setCursorPos({ x: e.clientX + window.scrollX, y: e.clientY + window.scrollY });
              }}
            >
              <img
                src={user.picture}
                alt={`${user.name.first} ${user.name.last}`}
                className="rounded-circle"
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
              <p className="mb-0">{`${user.name.first} ${user.name.last}`}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating placeholder that appears above the cursor when hovering a card */}
      {selectedIndex !== null && (
        <div
          className="click-tooltip bg-white border border-secondary shadow p-5"
          style={{
            top: Math.max(cursorPos.y - 20, 0),
            left: cursorPos.x,
          }}
        >
          Card placeholder for {selectedIndex}
        </div>
      )}
    </div>
  );
}