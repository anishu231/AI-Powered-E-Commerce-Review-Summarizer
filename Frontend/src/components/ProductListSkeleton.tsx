import React from 'react'

const ProductListSkeleton = () => {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default ProductListSkeleton