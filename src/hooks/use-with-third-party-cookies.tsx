/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved.
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useCallback, useEffect, useRef } from 'react';

interface ThirdPartyCookieStatus {
  checkCookieSupport: () => Promise<boolean | null>;
}

const IFRAME_TEST_URL = 'https://victor.com.de/cookiescheck/';
const IFRAME_TIMEOUT_MS = 5000;

export function useWithThirdPartyCookies(): ThirdPartyCookieStatus {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
      iframeRef.current = null;
    }
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  }, []);

  // Try Storage Access API first
  const checkStorageAccess = useCallback(async (): Promise<boolean | null> => {
    if ('hasStorageAccess' in document) {
      try {
        const hasAccess = await document.hasStorageAccess();
        return hasAccess;
      } catch (error) {
        // API exists but failed, continue to iframe test
        console.warn('Storage Access API check failed:', error);
      }
    }
    return null; // API not available or failed
  }, []);

  // Fallback to iframe test
  const checkWithIframe = useCallback((): Promise<boolean | null> => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.src = IFRAME_TEST_URL;
      iframe.sandbox.add('allow-scripts', 'allow-same-origin');
      iframe.style.display = 'none';
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';

      iframeRef.current = iframe;

      const handleMessage = (event: MessageEvent) => {
        console.log('handleMessage', event);
        // Verify the message is from our test iframe
        if (event.origin !== new URL(IFRAME_TEST_URL).origin) {
          return;
        }

        try {
          const data = JSON.parse(event.data);
          if ('result' in data && typeof data.result === 'boolean') {
            cleanup();
            resolve(data.result);
          }
        } catch (error) {
          // Not a valid JSON response, ignore
          console.warn('Failed to parse cookie test response:', error);
        }
      };

      window.addEventListener('message', handleMessage);
      cleanupRef.current = () => {
        window.removeEventListener('message', handleMessage);
      };

      // Send test message to iframe when it loads
      iframe.onload = () => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ test: 'cookie' }),
            '*'
          );
        }
      };

      // Set timeout in case iframe doesn't respond
      timeoutRef.current = setTimeout(() => {
        cleanup();
        resolve(null);
      }, IFRAME_TIMEOUT_MS);

      document.body.appendChild(iframe);
    });
  }, [cleanup]);

  // Function to trigger the check
  const checkCookieSupport = useCallback(async (): Promise<boolean | null> => {
    if (typeof window === 'undefined') {
      return null;
    }

    // Try Storage Access API first
    // const apiResult = await checkStorageAccess();
    // if (apiResult !== null) {
    //   return apiResult;
    // }

    // Storage API not available, use iframe test
    return await checkWithIframe();
  }, [checkStorageAccess, checkWithIframe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    checkCookieSupport,
  };
}
