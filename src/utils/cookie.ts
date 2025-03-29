import browser from 'webextension-polyfill';
import type { DomainState } from '../types';

/**
 * Get cookie info for a domain
 */
export async function getXdebugCookie(domain: string): Promise<browser.Cookies.Cookie | null> {
  try {
    // Try both HTTP and HTTPS for localhost
    if (domain.includes('localhost') || domain.match(/^(127\.0\.0\.1|::1)/)) {
      let cookie = await browser.cookies.get({
        name: 'XDEBUG_SESSION',
        url: `http://${domain}`
      });
      if (!cookie) {
        cookie = await browser.cookies.get({
          name: 'XDEBUG_SESSION',
          url: `https://${domain}`
        });
      }
      return cookie;
    }

    // For other domains, just try HTTP
    const cookie = await browser.cookies.get({
      name: 'XDEBUG_SESSION',
      url: `http://${domain}`
    });
    return cookie;
  } catch (error) {
    console.error('Failed to get cookie:', error);
    return null;
  }
}

/**
 * Get cookie domain based on the input domain
 */
function getCookieInfo(domain: string): { domain: string | undefined; url: string } {
  // Handle localhost and IP domains with ports
  if (domain.includes('localhost') || domain.match(/^(127\.0\.0\.1|::1)/)) {
    // Keep the port if it exists
    const [host, port] = domain.split(':');
    return {
      domain: undefined, // Let the browser handle the domain for localhost
      url: port ? `http://${host}:${port}` : `http://${host}`
    };
  }

  // For all other domains, include subdomains
  return {
    domain: `.${domain.replace(/^\./, '')}`,
    url: `http://${domain}`
  };
}

/**
 * Update xDebug cookie for a domain
 */
export async function updateXdebugCookie(domain: string, state: DomainState): Promise<void> {
  try {
    const { domain: cookieDomain, url } = getCookieInfo(domain);
    
    // Create both HTTP and HTTPS URLs for thorough cookie removal
    const httpUrl = url;
    const httpsUrl = url.replace('http://', 'https://');
    const urls = [httpUrl, httpsUrl];

    // Remove all existing debug cookies
    const cookieNames = ['XDEBUG_SESSION', 'XDEBUG_PROFILE', 'XDEBUG_TRACE', 'XDEBUG_TRIGGER'];
    for (const cookieUrl of urls) {
      for (const name of cookieNames) {
        try {
          await browser.cookies.remove({
            name,
            url: cookieUrl,
          });
        } catch (e) {
          // Ignore errors during removal
          console.log(`Failed to remove cookie ${name} for ${cookieUrl}`, e);
        }
      }
    }

    if (state.enabled) {
      // Set cookies for both HTTP and HTTPS for localhost
      const urlsToSet = domain.includes('localhost') || domain.match(/^(127\.0\.0\.1|::1)/) 
        ? urls 
        : [httpUrl];

      for (const urlToSet of urlsToSet) {
        // Set both XDEBUG_SESSION and XDEBUG_TRIGGER for better compatibility
        await browser.cookies.set({
          name: 'XDEBUG_SESSION',
          value: state.profile === 'custom' ? state.customKey || 'custom' : state.profile,
          url: urlToSet,
          domain: cookieDomain,
        });

        // Set XDEBUG_TRIGGER=1 to enable debugging when xdebug.start_with_request=trigger
        await browser.cookies.set({
          name: 'XDEBUG_TRIGGER',
          value: '1',
          url: urlToSet,
          domain: cookieDomain,
        });

        // Set mode-specific cookies
        if (state.mode === 'profile') {
          await browser.cookies.set({
            name: 'XDEBUG_PROFILE',
            value: '1',
            url: urlToSet,
            domain: cookieDomain,
          });
        } else if (state.mode === 'trace') {
          await browser.cookies.set({
            name: 'XDEBUG_TRACE',
            value: '1',
            url: urlToSet,
            domain: cookieDomain,
          });
        }
      }
    }
    // When disabled, we just remove all cookies and don't set any new ones
    // This ensures Xdebug won't trigger debugging sessions
  } catch (error) {
    console.error('Failed to update cookie:', error);
    throw new Error('Failed to update cookie: ' + (error instanceof Error ? error.message : String(error)));
  }
} 