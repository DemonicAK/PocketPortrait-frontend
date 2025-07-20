export async function fetchUser(): Promise<any | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include', // Important: includes cookies
    });

    if (!res.ok) throw new Error('Not authenticated');

    const data = await res.json();
    console.log('Fetched user data:', data.user);
    return data.user; // Return the user object directly
  } catch (err) {
    return null;
  }
}
