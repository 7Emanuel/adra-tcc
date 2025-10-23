export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Mock data for donations - in production, this would come from a database
    const mockDonations = [
      {
        id: 1,
        donorName: 'Ana Costa',
        donorEmail: 'ana@example.com',
        amount: 500,
        type: 'money',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        donorName: 'Carlos Silva',
        donorEmail: 'carlos@example.com',
        items: ['Arroz 5kg', 'Feijão 2kg'],
        type: 'items',
        status: 'pending',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ];

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const total = mockDonations.length;

    res.status(200).json({
      donations: mockDonations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}