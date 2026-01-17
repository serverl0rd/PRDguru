import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

export default function Sidebar() {
  const [prds, setPrds] = useState([]);

  useEffect(() => {
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
      }
    };

    fetchPrds();
  }, []);

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <button className="btn btn-primary w-full mb-4">New PRD</button>
      <div className="list flex-1 overflow-auto">
        {prds.map(prd => (
          <div key={prd.id} className="card mb-2">
            <Link href={`/prd/${prd.id}`} className="block p-4">
              {prd.title || 'Untitled PRD'}
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
