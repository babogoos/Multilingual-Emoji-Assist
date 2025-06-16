// This page now redirects to /emoji-assist
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/emoji-assist');
  // Next.js redirect is a server-side action, so technically this return is not reached
  // but it's good practice for components to return JSX or null.
  // However, in the case of redirect(), the rendering path is interrupted.
  // return null; 
}
