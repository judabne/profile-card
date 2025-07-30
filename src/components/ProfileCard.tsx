import React from "react";
import { User, UserDetails } from "../pages/index";
import LoadingPlaceholder from "./LoadingPlaceholder";
import UserAvatar from "./UserAvatar";

interface ProfileCardProps {
  user: User;
  userDetails: UserDetails | null;
  isUserDetailsLoading?: boolean;
  userDetailsError?: boolean
}

export default function ProfileCard({ user, userDetails, isUserDetailsLoading, userDetailsError }: ProfileCardProps) {
  const renderUserDetailsSection = () => {
    if (isUserDetailsLoading) {
      return <LoadingPlaceholder height="0.5rem" />;
    }
    if (userDetailsError) {
      return <div className="text-danger mt-3">Failed to load user details</div>;
    }
    if (userDetails) {
      return (
        <div className="mt-3">
          <div className="d-flex gap-2">
            <small><strong>{userDetails?.social.followers}</strong> followers</small>
            <small><strong>{userDetails?.social.following}</strong> following</small>
          </div>
          <div>
            <small className="d-block text-muted">Views: {userDetails?.analytics.pageViews}</small>
            <small className="d-block text-muted">Visitors: {userDetails?.analytics.uniqueVisitors}</small>
            <small className="d-block text-muted">Last Active: {new Date(userDetails?.activity.lastUpdated).toLocaleDateString()}</small>
            <small className="d-block text-muted">Active Since: {new Date(userDetails?.activity.accountCreated).toLocaleDateString()}</small>
          </div>
        </div>
      )
   }
  }
  return (
    <div className="d-flex gap-3 p-3 bg-white border border-secondary shadow rounded">
      <div>
        <UserAvatar 
          src={user.picture} 
          alt={`${user.name.first} ${user.name.last}`} 
          size={256}
          circular={false}
        />
      </div>
      <div>
        <h5 className="mb-1">{user.name.first} {user.name.last}, {user.dob.age}</h5>
        <p className="mb-0">{user.location.street.name}, {user.location.city}, {user.location.country}</p>
        <p className="mb-0">{user.email}</p>
        <p className="mb-0">{user.phone}</p>
        {renderUserDetailsSection()}
      </div>
    </div>
  )
}