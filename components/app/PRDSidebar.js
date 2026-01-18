import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { usePRD } from '../../context/PRDContext';

export default function PRDSidebar() {
  const { prds, setPrds, loadPRD, resetPRD, currentPRD } = usePRD();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrds();
  }, []);

  const fetchPrds = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/getPrds', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setPrds(data);
      }
    } catch (error) {
      console.error('Error fetching PRDs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPRD = () => {
    resetPRD();
  };

  const handleSelectPRD = (prd) => {
    loadPRD(prd);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <button onClick={handleNewPRD} className="btn btn-primary w-full h-9 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New PRD
        </button>
      </div>

      {/* PRD List */}
      <div className="flex-1 overflow-auto scroll-area">
        {loading ? (
          <div className="p-4 text-sm text-muted">Loading...</div>
        ) : prds.length === 0 ? (
          <div className="p-4 text-sm text-muted text-center">
            No PRDs yet. Start a conversation to create one.
          </div>
        ) : (
          <div className="divide-y">
            {prds.map(prd => (
              <button
                key={prd.id}
                onClick={() => handleSelectPRD(prd)}
                className={`w-full text-left p-4 hover:bg-[var(--muted)] transition-colors ${
                  currentPRD.id === prd.id ? 'bg-[var(--muted)]' : ''
                }`}
              >
                <p className="font-medium text-sm truncate">
                  {prd.title || 'Untitled PRD'}
                </p>
                <p className="text-xs text-muted mt-1 truncate">
                  {prd.objective || 'No objective set'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
