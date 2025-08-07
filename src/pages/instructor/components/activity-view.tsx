import ViewUserGoogleDocs from '../../../components/admin-view/admin-view-docs';
import DocView from '../../../components/doc-view';
import React, { useState } from 'react';

export function ActivityView(props: { activityId: string }): JSX.Element {
  const { activityId } = props;
  const [selectedDocId, setSelectedDocId] = useState<string>();

  if (!selectedDocId) {
    return (
      <ViewUserGoogleDocs
        goToDoc={(docId: string) => {
          setSelectedDocId(docId);
        }}
        onHistoryClicked={() => {
          console.log('history clicked');
        }}
      />
    );
  }

  return (
    <DocView
      docId={selectedDocId}
      activityId={activityId}
      disableActivitySelector={true}
    />
  );
}
