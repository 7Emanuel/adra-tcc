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
    // Mock data for requests - in production, this would come from a database
    const mockRequests = [
      {
        id: 1,
        beneficiaryName: 'João Silva',
        items: ['Arroz 5kg', 'Óleo 1L'],
        status: 'pending',
        priority: 'high',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        beneficiaryName: 'Maria Santos',
        items: ['Leite em pó', 'Fralda G'],
        status: 'fulfilled',
        priority: 'medium',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ];

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const total = mockRequests.length;

    res.status(200).json({
      requests: mockRequests,
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