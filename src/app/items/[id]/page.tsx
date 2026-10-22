import { notFound } from 'next/navigation';

// モックデータ由来のアイテムページは廃止（存在しないページとして扱う）
export default function ItemPage() {
  notFound();
}
