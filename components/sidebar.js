import { useEffect, useState } from 'react';
import { Button, Card, List } from '@shadcn/ui';
import Link from 'next/link';

export default function Sidebar() {
  const [prds, setPrds] = useState([]);

  useEffect(() => {
    const fetchPrds = async () => {
      try {
        const response = await fetch('/api/getPrds');
        const data = await response.json();
        setPrds(data);
      } catch (error) {
        console.error('Error fetching PRDs:', error);
      }
    };

    fetchPrds();
  }, []);

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <Button className="w-full mb-4" color="primary">
        New PRD
      </Button>
      <List className="flex-1 overflow-auto">
        {prds.map(prd => (
          <Card key={prd.id} className="mb-2">
            <Link href={`/prd/${prd.id}`}>
              <a className="block p-4">{prd.title}</a>
            </Link>
          </Card>
        ))}
      </List>
    </aside>
  );
}