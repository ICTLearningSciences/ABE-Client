/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import React, { useEffect, useState } from 'react';
import { DocData } from '../../../types';
import { useDebouncedCallback } from '../../../hooks/use-debounced-callback';
import './raw-text-editor.css';

import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useWithRawTextDocVersions } from '../../../hooks/use-with-raw-text-doc-versions';
import { getDocData, useWithUsersDocs } from '../../../exported-files';

const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
};

// Plugin to set initial document content
function InitialDocumentPlugin({ docData }: { docData?: DocData }) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (docData?.plainText && !initialized) {
      editor.update(() => {
        const root = $getRoot();
        // Clear any existing content
        root.clear();

        // Create paragraph nodes for each line
        const paragraphs = docData.plainText.split('\n');
        paragraphs.forEach((paragraph) => {
          const paragraphNode = $createParagraphNode();
          if (paragraph.trim().length > 0) {
            paragraphNode.append($createTextNode(paragraph));
          }
          root.append(paragraphNode);
        });
      });
      setInitialized(true);
    }
  }, [editor, docData, initialized]);

  return null;
}

// Plugin to autosave content changes
function AutoSavePlugin({ onChange }: { onChange: (text: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const debouncedOnChange = useDebouncedCallback((text: string) => {
    onChange(text);
  }, 1000);

  useEffect(() => {
    const removeListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        debouncedOnChange(text);
      });
    });

    return () => {
      removeListener();
    };
  }, [editor, debouncedOnChange]);

  return null;
}

// Focus plugin
function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

// Error handler
function onError(error: Error) {
  console.error(error);
}

interface RawTextDocumentProps {
  docId?: string;
}

export function RawTextDocument({ docId }: RawTextDocumentProps = {}) {
  const [docData, setDocData] = useState<DocData | undefined>();
  const [loading, setLoading] = useState<boolean>(!!docId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const { submitDocVersion } = useWithRawTextDocVersions();
  const { updateDocTitleLocally } = useWithUsersDocs();
  const handleTextChange = async (text: string) => {
    if (docId) {
      try {
        console.log('submitting doc version');
        await submitDocVersion(text, docData?.title || 'Raw Text Document');
      } catch (error) {
        console.error('Error updating document text:', error);
      }
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    if (docId && docData) {
      try {
        await submitDocVersion(docData.plainText || '', newTitle);
        setDocData({ ...docData, title: newTitle });
        setIsEditingTitle(false);
        updateDocTitleLocally(docId, newTitle);
      } catch (error) {
        console.error('Error updating document title:', error);
      }
    }
  };

  const startEditing = () => {
    setTempTitle(docData?.title || '');
    setIsEditingTitle(true);
  };

  const cancelEditing = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  // Initial load of doc data.
  useEffect(() => {
    if (docId) {
      setLoading(true);
      getDocData(docId)
        .then((docData) => {
          setDocData(docData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [docId]);

  const initialConfig: InitialConfigType = {
    namespace: 'RawTextEditor',
    theme,
    onError,
    editable: true,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="raw-text-editor-container">
      <div className="raw-text-editor-header">
        {isEditingTitle ? (
          <div className="raw-text-editor-title-edit">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="raw-text-editor-title-input"
              autoFocus
            />
            <div className="raw-text-editor-title-actions">
              <IconButton
                onClick={() => handleTitleChange(tempTitle)}
                size="small"
              >
                <SaveIcon />
              </IconButton>
              <IconButton onClick={cancelEditing} size="small">
                <CancelIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="raw-text-editor-title-container">
            <div className="raw-text-editor-title">
              {docData?.title || 'Untitled Document'}
            </div>
            <IconButton onClick={startEditing} size="small">
              <EditIcon />
            </IconButton>
          </div>
        )}
      </div>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="raw-text-editor-content">
          <PlainTextPlugin
            contentEditable={<ContentEditable className="raw-text-editor" />}
            placeholder={
              <div className="raw-text-editor-placeholder">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <InitialDocumentPlugin docData={docData} />
          <AutoSavePlugin onChange={handleTextChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}
