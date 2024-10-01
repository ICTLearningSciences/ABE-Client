/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import ViewUserGoogleDocs from '../../components/admin-view/admin-view-docs';
import { useWithGoogleDocs } from '../../hooks/use-with-google-docs';
import withAuthorizationOnly from '../../hooks/wrap-with-authorization-only';

export enum AdminPages {
  VIEW_ADMIN_ACTIONS = 'VIEW_ADMIN_ACTIONS',
  VIEW_USER_DOCS = 'VIEW_USER_DOCS',
  AUTHOR_GOOGLE_DOCS = 'AUTHOR_GOOGLE_DOCS',
}

/**
 * Manages admin view by:
 * 1. Preloading all data hooks for all pages
 * 2. Switch between pages and pass respective data hooks
 * 3. Provide each page with a way to return to admin actions
 */
function AdminView(): JSX.Element {
  const _useWithGoogleDocs = useWithGoogleDocs();
  return <ViewUserGoogleDocs useWithGoogleDocs={_useWithGoogleDocs} />;
}

export default withAuthorizationOnly(AdminView);
