import { useEffect } from 'react';
import withAuthorizationOnly from '../hooks/wrap-with-authorization-only';
import UserEditGoogleDoc from './user-view/user-edit-google-doc';
import { useNavigate, useParams } from 'react-router-dom';
import { useWithState } from '../store/slices/state/use-with-state';

function DocView(): JSX.Element {
  const { docId } = useParams<Record<string, string>>();
  const navigate = useNavigate();
  const { updateCurrentDocId } = useWithState();

  useEffect(() => {
    if (docId) {
      updateCurrentDocId(docId);
    }
  }, [docId]);

  if (!docId) {
    navigate('/');
    return <></>;
  }

  return <UserEditGoogleDoc googleDocId={docId} />;
}

export default withAuthorizationOnly(DocView);
