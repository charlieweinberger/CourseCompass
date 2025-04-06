"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

// TODO move this into settings/profile page within dashboard

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const [imgError, setImgError] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  // Move date formatting to useEffect to prevent hydration mismatch
  useEffect(() => {
    if (user?.updated_at) {
      setFormattedDate(new Date(user.updated_at).toLocaleDateString());
    }
  }, [user?.updated_at]);

  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (isLoading)
    return <div className="flex justify-center py-8">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="flex flex-col items-center p-8 bg-white shadow-sm rounded-lg max-w-md mx-auto">
        {user.picture && !imgError ? (
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={user.picture}
              alt={user.name || "User profile"}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 100px, 100px"
              priority
            />
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <h2 className="mt-6 text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-600 mt-2">{user.email}</p>

        <div className="mt-8 w-full">
          <h3 className="font-semibold mb-2 text-gray-700">
            Profile Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {user.sub && (
              <div className="mb-2">
                <span className="text-sm text-gray-500">User ID:</span>
                <p className="text-sm truncate">{user.sub}</p>
              </div>
            )}
            {user.updated_at && (
              <div>
                <span className="text-sm text-gray-500">Last Login:</span>
                <p className="text-sm">{formattedDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
