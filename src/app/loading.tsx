export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50">
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-primary/20"></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading amazing content...</p>
      </div>
    </div>
  );
}
