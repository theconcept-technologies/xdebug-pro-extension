import browser from 'webextension-polyfill';
import { DomainState, sanitizeDomain } from '../types';

const XDEBUG_COOKIE_NAME = 'XDEBUG_SESSION';

/**
 * Updates the Xdebug session cookie for a domain
 * @param domain - The domain to update the cookie for
 * @param state - The domain state containing profile and enabled status
 * @returns Promise that resolves when the cookie is updated
 */
export async function updateXdebugCookie(domain: string, state: DomainState): Promise<void> {
  const sanitizedDomain = sanitizeDomain(domain);
  if (!sanitizedDomain) {
    throw new Error('Invalid domain');
  }

  try {
    if (state.enabled) {
      const cookieValue = state.customKey || state.profile;
      await browser.cookies.set({
        url: `http://${sanitizedDomain}`,
        name: XDEBUG_COOKIE_NAME,
        value: cookieValue,
        domain: sanitizedDomain,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
      });
    } else {
      await browser.cookies.remove({
        url: `http://${sanitizedDomain}`,
        name: XDEBUG_COOKIE_NAME
      });
    }
  } catch (error) {
    console.error('Failed to update Xdebug cookie:', error);
    throw error;
  }
}

/**
 * Gets the current Xdebug session cookie for a domain
 * @param domain - The domain to get the cookie for
 * @returns Promise that resolves with the cookie value or null if not found
 */
export async function getXdebugCookie(domain: string): Promise<string | null> {
  const sanitizedDomain = sanitizeDomain(domain);
  if (!sanitizedDomain) {
    throw new Error('Invalid domain');
  }

  try {
    const cookie = await browser.cookies.get({
      url: `http://${sanitizedDomain}`,
      name: XDEBUG_COOKIE_NAME
    });
    return cookie?.value || null;
  } catch (error) {
    console.error('Failed to get Xdebug cookie:', error);
    throw error;
  }
} 