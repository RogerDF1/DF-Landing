import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { boardId } = req.query; // ID del tablero desde el cliente
  const apiKey = process.env.NEXT_PUBLIC_TRELLO_API;
  const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN;

  if (!boardId || !apiKey || !apiToken) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}`
    );
    
    // Devolvemos los datos al cliente
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Trello.' });
  }
}
