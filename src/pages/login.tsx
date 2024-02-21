import { UseWithLogin } from '../store/slices/login/use-with-login';
import { LoginStatus } from '../store/slices/login';
import { Button, CircularProgress } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import AbeTitle from '../static-images/abe-title.png';
import { ColumnCenterDiv, ColumnDiv } from '../styled-components';

export default function Login(props: { useLogin: UseWithLogin }): JSX.Element {
  const { useLogin } = props;
  const { loginWithGoogle, state: loginState } = useLogin;
  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginWithGoogle(tokenResponse.access_token);
    },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ColumnCenterDiv
        style={{
          width: '400px',
          textAlign: 'center',
          border: '1px solid lightgrey',
          padding: '20px',
          boxShadow: '-5px 5px 10px 0px rgba(0,0,0,0.75)',
        }}
      >
        <ColumnDiv
          style={{
            marginBottom: '20px',
          }}
        >
          <img
            style={{ width: '320px', height: 'auto' }}
            src={AbeTitle}
            alt="ABE"
          />
          <span style={{ fontSize: '22px' }}>
            AI for Brainstorming and Editing
          </span>
        </ColumnDiv>
        <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
          Presented by USC Center for Generative AI and Society
        </span>
        <div>
          {loginState.loginStatus === LoginStatus.IN_PROGRESS ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => loginGoogle()}
              style={{
                fontSize: '16px',
                margin: '10px',
                width: 300,
              }}
              data-cy="login-btn"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </ColumnCenterDiv>
    </div>
  );
}
