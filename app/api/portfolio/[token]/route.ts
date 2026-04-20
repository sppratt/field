import { getPortfolioByToken } from '@/lib/db/portfolio';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    if (!token) {
      return Response.json(
        { error: 'Portfolio token is required' },
        { status: 400 }
      );
    }

    const portfolioData = await getPortfolioByToken(token);

    if (!portfolioData) {
      return Response.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return Response.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return Response.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
