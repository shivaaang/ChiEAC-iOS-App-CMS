//
//  EmptyState.tsx
//  ChiEAC
//
//  Empty state component for form submissions
//  Created by Shivaang Kumar on 8/20/25.
//

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
        <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-300 mb-2">No form submissions yet</h3>
      <p className="text-slate-500">Form submissions from your iOS app will appear here.</p>
    </div>
  );
};

export default EmptyState;
