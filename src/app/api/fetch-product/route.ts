import { NextRequest } from 'next/server';
import { GET as handleScrapeGet, POST as handleScrapePost } from '../amazon-scrape/route';

export async function GET(req: NextRequest) {
  return handleScrapeGet(req);
}

export async function POST(req: NextRequest) {
  return handleScrapePost(req);
}
