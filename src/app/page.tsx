// This page now redirects to an external Linktree URL
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/emoji-assist');
  // Next.js redirect is a server-side action, so technically this return is not reached.
  // However, in the case of redirect(), the rendering path is interrupted.
  // return null; 
}
