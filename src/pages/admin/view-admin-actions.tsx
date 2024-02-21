import { Button } from '@mui/material';
import { ColumnDiv, RowDivSB } from '../../styled-components';

export interface ViewAdminActionProps {
  returnToAdminActions: () => void;
  onSetPageToViewUserDocs: () => void;
  onSetPageToAuthorGoogleDocs: () => void;
}

function AdminActionItem(props: {
  title: string;
  onClick: () => void;
}): JSX.Element {
  const { title, onClick } = props;
  return (
    <RowDivSB
      style={{
        alignItems: 'center',
      }}
    >
      <h3>{title}</h3>
      <Button
        variant="outlined"
        onClick={onClick}
        style={{ height: 'fit-content' }}
      >
        Go
      </Button>
    </RowDivSB>
  );
}

export function ViewAdminActions(props: ViewAdminActionProps): JSX.Element {
  return (
    <ColumnDiv
      style={{
        width: '20%',
        borderBottom: '1px solid black',
        padding: '10px',
        alignItems: 'center',
      }}
    >
      <h3>Admin Actions</h3>
      <AdminActionItem
        title="View My Docs"
        onClick={props.onSetPageToViewUserDocs}
      />
      <AdminActionItem
        title="Author Google Docs"
        onClick={props.onSetPageToAuthorGoogleDocs}
      />
    </ColumnDiv>
  );
}
