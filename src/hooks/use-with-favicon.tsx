/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useEffect } from 'react';
import { useWithConfig } from '../store/slices/config/use-with-config';

export function useWithFavicon() {
  const config = useWithConfig();
  const orgName = config.state.config?.orgName || 'abe';
  const configLoaded = config.isConfigLoaded();
  const timestamp = new Date().getTime();

  useEffect(() => {
    if (!configLoaded) {
      return;
    }

    // Remove existing favicon
    const links = document.querySelectorAll('link[rel="icon"]');
    links.forEach((link) => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });

    // Add new favicon
    const link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.href = `/${orgName}-favicon.ico?v=${timestamp}`;
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      const favicon = document.getElementById('favicon');
      if (favicon && favicon.parentNode) {
        favicon.parentNode.removeChild(favicon);
      }
    };
  }, [configLoaded]);
}
