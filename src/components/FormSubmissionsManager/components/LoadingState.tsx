//
//  LoadingState.tsx
//  ChiEAC
//
//  Loading state component for form submissions
//  Created by Shivaang Kumar on 8/20/25.
//

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-slate-300 font-medium">Loading submissions...</span>
      </div>
    </div>
  );
};

export default LoadingState;
