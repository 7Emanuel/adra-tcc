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
    // Mock data for beneficiaries - in production, this would come from a database
    const mockBeneficiaries = [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '(11) 88888-8888',
        status: 'validated',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ];

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const total = mockBeneficiaries.length;

    res.status(200).json({
      beneficiaries: mockBeneficiaries,
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