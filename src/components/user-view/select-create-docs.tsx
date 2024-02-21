import React from 'react';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { GoogleDoc } from '../../types';
import ExampleGoogleDocModal from './example-google-docs-modal';
import { RowDiv } from '../../styled-components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { formatISODateToReadable } from '../../helpers';
import DescriptionIcon from '@mui/icons-material/Description';
import { Delete } from '@mui/icons-material';
import './select-create-docs.css';
import { useNavigate } from 'react-router-dom';

export default function SelectCreateDocs(props: {
  googleDocs?: GoogleDoc[];
  copyGoogleDocs?: GoogleDoc[];
  creationInProgress: boolean;
  handleCreateGoogleDoc: (
    docIdToCopy?: string,
    title?: string,
    isAdminDoc?: boolean
  ) => void;
}): JSX.Element {
  const {
    googleDocs,
    copyGoogleDocs,
    creationInProgress,
    handleCreateGoogleDoc,
  } = props;
  const [createDocOpen, setCreateDocOpen] = React.useState(false);
  const navigate = useNavigate();

  function googleDocsDisplay() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          // overflowY: 'auto',
        }}
      >
        <RowDiv
          style={{
            position: 'relative',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RowDiv
            style={{
              position: 'absolute',
              left: 0,
            }}
          >
            <Button
              onClick={() => {
                handleCreateGoogleDoc();
              }}
              size="large"
              style={{
                fontWeight: 'bold',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              + New
            </Button>
            <Button
              onClick={() => {
                setCreateDocOpen(true);
              }}
              size="large"
              variant="text"
            >
              Examples
            </Button>
          </RowDiv>
          <h2>Your Docs</h2>
        </RowDiv>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ height: '0px', padding: 0, margin: 0 }}>
              <TableRow>
                <TableCell style={{ width: '66%', padding: 0 }}></TableCell>
                <TableCell style={{ padding: 0 }}></TableCell>
                <TableCell style={{ padding: 0 }}></TableCell>{' '}
                {/* Empty cell for delete button */}
              </TableRow>
            </TableHead>

            <TableBody>
              {googleDocs?.map((doc, index) => (
                <TableRow
                  key={index}
                  className="google-doc-item-row"
                  onDoubleClick={() => {
                    navigate(`/docs/${doc.googleDocId}`);
                  }}
                >
                  <TableCell>
                    <RowDiv>
                      <DescriptionIcon />
                      <span
                        className="google-doc-item-name"
                        data-cy={`doc-list-item-${doc.title.replaceAll(
                          ' ',
                          '-'
                        )}`}
                        onClick={() => {
                          navigate(`/docs/${doc.googleDocId}`);
                        }}
                      >
                        {doc.title || 'My Document'}
                      </span>
                    </RowDiv>
                  </TableCell>
                  <TableCell>
                    {formatISODateToReadable(doc.createdAt)}
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  if (creationInProgress) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {googleDocsDisplay()}
      <ExampleGoogleDocModal
        open={createDocOpen}
        close={() => {
          setCreateDocOpen(false);
        }}
        adminDocs={copyGoogleDocs}
        onCreateDoc={handleCreateGoogleDoc}
      />
    </div>
  );
}
