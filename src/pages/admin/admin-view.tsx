import ViewUserGoogleDocs from '../../components/admin-view/admin-view-docs';
import { UseWithGoogleDocs } from '../../hooks/use-with-google-docs';
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
  const useWithGoogleDocs = UseWithGoogleDocs();
  return <ViewUserGoogleDocs useWithGoogleDocs={useWithGoogleDocs} />;
}

export default withAuthorizationOnly(AdminView);
