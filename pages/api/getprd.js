import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'prds'));
      const prds = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.status(200).json(prds);
    } catch (e) {
      res.status(500).json({ error: 'Error fetching documents: ' + e.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}