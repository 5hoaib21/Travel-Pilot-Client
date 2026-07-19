'use client'

import TripCard from './TripCard'

export default function TripGrid({ trips, onDelete, onFavoriteToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          onDelete={onDelete}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}
