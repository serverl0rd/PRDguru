import { useEffect, useState } from "react";

export default function Sidebar() {
  const [prds, setPrds] = useState([]);

  useEffect(() => {
    const fetchPrds = async () => {
      const response = await fetch('/api/getPrds');
      const data = await response.json();
      setPrds(data);
    };

    fetchPrds();
  }, []);

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <button className="bg-blue-500 px-4 py-2 mb-4">
          Add PRD
        </button>
        <ul>
          {prds.map(prd => (
            <li key={prd.id} className="mb-2">{prd.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}