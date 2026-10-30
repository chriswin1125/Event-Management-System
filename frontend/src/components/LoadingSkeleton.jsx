import React from 'react';

export const EventCardSkeleton = () => (
  <div className="bg-[#F5F5F7] rounded-3xl p-5 flex flex-col h-[520px] animate-pulse">
    <div className="w-full h-64 sm:h-72 bg-neutral-200 rounded-2xl mb-5"></div>
    <div className="space-y-3 px-2 flex-1">
      <div className="h-4 bg-neutral-200 rounded-md w-1/3"></div>
      <div className="h-7 bg-neutral-200 rounded-md w-4/5"></div>
      <div className="h-4 bg-neutral-200 rounded-md w-2/3"></div>
    </div>
    <div className="mt-auto px-2 pt-5 border-t border-neutral-200/60 flex items-center justify-between">
      <div className="h-6 bg-neutral-200 rounded-md w-1/4"></div>
      <div className="h-10 bg-neutral-200 rounded-full w-32"></div>
    </div>
  </div>
);

export const EventGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

export default EventCardSkeleton;
