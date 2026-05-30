export async function computeAdminToken(): Promise<string> {
  const raw = `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_SECRET ?? 'bookease_default'}`;
  const data = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const COOKIE_NAME = 'be_admin_session';
