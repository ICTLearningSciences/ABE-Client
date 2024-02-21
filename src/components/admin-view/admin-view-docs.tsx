import { UseWithGoogleDocs } from '../../hooks/use-with-google-docs';
import { ColumnCenterDiv } from '../../styled-components';
import SelectCreateDocs from '../user-view/select-create-docs';

export interface AdminViewUserGoogleDocsProps {
  useWithGoogleDocs: UseWithGoogleDocs;
}

export default function ViewUserGoogleDocs(
  props: AdminViewUserGoogleDocsProps
): JSX.Element {
  const { useWithGoogleDocs } = props;
  const {
    googleDocs,
    copyGoogleDocs,
    creationInProgress,
    handleCreateGoogleDoc,
  } = useWithGoogleDocs;

  return (
    <ColumnCenterDiv
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <SelectCreateDocs
        googleDocs={googleDocs}
        copyGoogleDocs={copyGoogleDocs}
        creationInProgress={creationInProgress}
        handleCreateGoogleDoc={handleCreateGoogleDoc}
      />
    </ColumnCenterDiv>
  );
}
