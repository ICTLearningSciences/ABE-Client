import React from 'react';
import withAuthorizationOnly from '../../../hooks/wrap-with-authorization-only';
import { UseWithLogin } from '../../../store/slices/login/use-with-login';
import Header from '../../header/header';
import { DocumentTimelinePage } from './index';
import { useParams } from 'react-router-dom';
import { useNavigateWithParams } from '../../../hooks/use-navigate-with-params';

function DocHistoryContainer(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { docId } = useParams<Record<string, string>>();
  const navigate = useNavigateWithParams();
  return (
    <>
      <Header useLogin={useLogin} homeNavPath="/docs" />
      <div
        style={{
          width: '100%',
          height: '94%', //header takes 6%
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DocumentTimelinePage
          returnToDocs={() => navigate(`/docs`)}
          docIdFromParams={docId || ''}
        />
      </div>
    </>
  );
}

export default withAuthorizationOnly(DocHistoryContainer);
