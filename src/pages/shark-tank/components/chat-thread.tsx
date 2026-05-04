/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import * as React from 'react';
import { Button, Typography } from '@mui/material';
import { Construction, ForumOutlined } from '@mui/icons-material';
import {
  ChatActivity,
  useWithCurrentGoalActivity,
} from '../../../exported-files';
import { useWithPanels } from '../../../store/slices/panels/use-with-panels';
import { useSearchParams } from 'react-router-dom';
import { URL_PARAM_NEW_DOC } from '../../../constants';
import { useWithWindowSize } from '../../../hooks/use-with-window-size';

export function stringToColor(string: string) {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function ChatThread(props: {
  currentDoc?: string;
}): JSX.Element {
  const { activity } = useWithPanels();
  const [urlSearchParams] = useSearchParams();
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const isNewDoc = urlSearchParams.get(URL_PARAM_NEW_DOC) === 'true';
  const { height } = useWithWindowSize();

  const [previewingActivity, setPreviewingActivity] =
    React.useState<boolean>(false);
  const [mobileView, setMobileView] = React.useState<'chat' | 'document'>(
    'chat'
  );

  return (
    <div
      className="box column"
      style={{
        height: '100%',
        borderRadius: 0,
        padding: 0,
        boxShadow: '-5px 1px 10px 0px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ maxHeight: height - 150 }}>
        <ChatActivity
          activityFromParams={activity?._id || ''}
          goalFromParams={''}
          isNewDoc={isNewDoc}
          useCurrentGoalActivity={useCurrentGoalActivity}
          previewingActivity={previewingActivity}
          setPreviewingActivity={setPreviewingActivity}
          disableActivitySelector={false}
          setToDocView={() => setMobileView('document')}
        />
      </div>
    </div>
  );
}
