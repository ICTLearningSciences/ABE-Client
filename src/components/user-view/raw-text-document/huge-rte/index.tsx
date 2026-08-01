/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { useEffect, useRef, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import Showdown from "showdown";
import { Editor } from "@hugerte/hugerte-react";
import {
  CircularProgress,
  TextField,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";

import { ColumnDiv } from "../../../../styled-components";
import type { DocData } from "../../../../types";
import { useWithRawTextDocVersions } from "../../../../hooks/use-with-raw-text-doc-versions";
import { getDocData } from "../../../../hooks/api";
import { useWithUsersDocs } from "../../../../exported-files";

import "./huge-rte.css";

interface RawTextDocumentProps {
  docId?: string;
  currentActivityId: string;
}

export function HugeRTEEditor({
  docId,
  currentActivityId,
}: RawTextDocumentProps) {
  const [docData, setDocData] = useState<DocData | undefined>();
  console.log(docData);
  const [initialDocData, setInitialDocData] = useState<DocData | undefined>();
  const [loading, setLoading] = useState<boolean>(!!docId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  useWithRawTextDocVersions(currentActivityId, docData);
  const { updateDocTitleLocally } = useWithUsersDocs();
  const converter = new Showdown.Converter({
    smartIndentationFix: true,
  });

  const editor = useRef<Editor>(null);

  const editorConfig = useMemo(
    () => ({
      plugins: ["markdown", "lists"],
      toolbar: [
        { name: "history", items: ["undo", "redo"] },
        { name: "styles", items: ["styles"] },
        { name: "formatting", items: ["bold", "italic"] },
        {
          name: "alignment",
          items: ["alignleft", "aligncenter", "alignright", "alignjustify"],
        },
        { name: "indentation", items: ["outdent", "indent"] },
        { name: "lists", items: ["unordered", "ordered"] },
      ],
    }),
    [],
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce((htmlText: string) => {
        const rawText = editor.current?.editor?.getContent({ format: "text" });
        const mdText = converter.makeMarkdown(htmlText);
        if (docData) {
          console.log("debouncedUpdate", rawText, mdText);
          setDocData((prevValue) => {
            if (prevValue) {
              return {
                ...prevValue,
                plainText: rawText || mdText,
                markdownText: mdText,
                lastChangedId: docData.lastChangedId || "",
              };
            }
            return prevValue;
          });
        }
      }, 500),
    [docData, editor],
  );

  useEffect(() => {
    if (docId) {
      setLoading(true);
      getDocData(docId, "RAW_TEXT")
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

  const handleEditorChange = (value: string) => {
    debouncedUpdate(value);
  };

  const handleTitleChange = async (newTitle: string) => {
    if (docId && docData) {
      try {
        setDocData({ ...docData, title: newTitle });
        setIsEditingTitle(false);
        updateDocTitleLocally(docId, newTitle);
      } catch (error) {
        console.error("Error updating document title:", error);
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
        initialValue={converter.makeHtml(initialDocData?.markdownText || "")}
        ref={editor}
        onChange={(value) => {
          console.log(value.target);
        }}
        plugins={editorConfig.plugins}
        toolbar={editorConfig.toolbar}
        onEditorChange={handleEditorChange}
        // onInput={(value) => {
        //   console.log(value)
        //   console.log(value.target.value);
        //   handleEditorChange(value.target.value);
        // }}
      />
    ),
    [initialDocData, editor, handleEditorChange],
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
        height: "95%",
        width: "95%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          position: "relative",
        }}
      >
        {isEditingTitle ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              size="small"
              autoFocus
            />
            <IconButton onClick={handleSaveEdit} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={handleCancelEdit} color="error">
              <Cancel />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ textAlign: "center" }}
            >
              {docData.title || "New Document"}
            </Typography>
            <IconButton
              onClick={() => {
                setTempTitle(docData.title);
                setIsEditingTitle(true);
              }}
              size="small"
            >
              <Edit />
            </IconButton>
          </Box>
        )}
      </Box>
      {MemoizedEditor}
    </ColumnDiv>
  );
}
