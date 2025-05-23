import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Editor } from '@hugerte/hugerte-react';
import { ColumnDiv } from '../../../../styled-components';
import {
  CircularProgress,
  TextField,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { DocData, DocService } from '../../../../types';
import { useWithRawTextDocVersions } from '../../../../hooks/use-with-raw-text-doc-versions';
import { getDocData } from '../../../../hooks/api';
import debounce from 'lodash/debounce';
import { useWithUsersDocs } from '../../../../exported-files';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import './huge-rte.css';
import Showdown from 'showdown';

interface RawTextDocumentProps {
  docId?: string;
  currentActivityId: string;
}

export function HugeRTEEditor({
  docId,
  currentActivityId,
}: RawTextDocumentProps) {
  const [docData, setDocData] = useState<DocData | undefined>();
  const [initialDocData, setInitialDocData] = useState<DocData | undefined>();
  const [loading, setLoading] = useState<boolean>(!!docId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  useWithRawTextDocVersions(currentActivityId, docData);
  const { updateDocTitleLocally } = useWithUsersDocs();
  const converter = new Showdown.Converter({
    smartIndentationFix: true,
  });

  const editor = useRef<Editor>(null);

  const editorConfig = useMemo(
    () => ({
      plugins: ['markdown', 'lists'],
      toolbar: [
        { name: 'history', items: ['undo', 'redo'] },
        { name: 'styles', items: ['styles'] },
        { name: 'formatting', items: ['bold', 'italic'] },
        {
          name: 'alignment',
          items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'],
        },
        { name: 'indentation', items: ['outdent', 'indent'] },
        { name: 'lists', items: ['unordered', 'ordered'] },
      ],
    }),
    []
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce((htmlText: string) => {
        const rawText = editor.current?.editor?.getContent({ format: 'text' });
        const mdText = converter.makeMarkdown(htmlText);
        if (docData) {
          setDocData((prevValue) => {
            if (prevValue) {
              return {
                ...prevValue,
                plainText: rawText || mdText,
                markdownText: mdText,
                lastChangedId: docData.lastChangedId || '',
              };
            }
            return prevValue;
          });
        }
      }, 500),
    [docData]
  );

  useEffect(() => {
    if (docId) {
      setLoading(true);
      getDocData(docId, DocService.RAW_TEXT)
        .then((docData) => {
          setDocData(docData);
          setInitialDocData(docData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [docId]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleEditorChange = useCallback(
    (value: string) => {
      debouncedUpdate(value);
    },
    [debouncedUpdate]
  );

  const handleTitleChange = async (newTitle: string) => {
    if (docId && docData) {
      try {
        setDocData({ ...docData, title: newTitle });
        setIsEditingTitle(false);
        updateDocTitleLocally(docId, newTitle);
      } catch (error) {
        console.error('Error updating document title:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    if (docData) {
      setTempTitle(docData.title);
      setIsEditingTitle(false);
    }
  };

  const handleSaveEdit = () => {
    handleTitleChange(tempTitle);
  };

  const MemoizedEditor = useMemo(
    () => (
      <Editor
        initialValue={converter.makeHtml(initialDocData?.markdownText || '')}
        ref={editor}
        onChange={(value) => {
          console.log(value.target);
        }}
        plugins={editorConfig.plugins}
        toolbar={editorConfig.toolbar}
        onEditorChange={handleEditorChange}
      />
    ),
    [initialDocData]
  );

  if (loading || !docData) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ColumnDiv
      data-cy="hugerte-container"
      style={{
        height: '95%',
        width: '95%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          position: 'relative',
        }}
      >
        {isEditingTitle ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              size="small"
              autoFocus
            />
            <IconButton onClick={handleSaveEdit} color="primary">
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleCancelEdit} color="error">
              <CancelIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ textAlign: 'center' }}
            >
              {docData.title || 'New Document'}
            </Typography>
            <IconButton
              onClick={() => {
                setTempTitle(docData.title);
                setIsEditingTitle(true);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      {MemoizedEditor}
    </ColumnDiv>
  );
}
