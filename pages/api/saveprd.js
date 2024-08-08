import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const prd = req.body;

    try {
      const docRef = await addDoc(collection(db, 'prds'), prd);
      res.status(200).json({ id: docRef.id });
    } catch (e) {
      res.status(500).json({ error: 'Error adding document: ' + e.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}