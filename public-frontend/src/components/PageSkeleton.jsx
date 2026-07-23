import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 max-w-4xl mx-auto py-8">
      {/* Title skeleton */}
      <div className="h-10 bg-slate-200 rounded-2xl w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
      <div className="h-px bg-slate-200 my-8"></div>

      {/* Paragraph blocks skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded-xl w-full"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-5/6"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-4/6"></div>
      </div>

      {/* Box skeleton */}
      <div className="h-48 bg-slate-200 rounded-2xl w-full my-8"></div>

      {/* List skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded-xl w-2/3"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded-xl w-3/5"></div>
      </div>
    </div>
  );
};

export default PageSkeleton;
