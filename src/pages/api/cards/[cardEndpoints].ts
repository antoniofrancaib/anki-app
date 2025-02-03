import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Stub logic or real logic goes here
  // For now, just return a simple JSON response
  res.status(200).json({ message: 'Stub card endpoint' });
}
