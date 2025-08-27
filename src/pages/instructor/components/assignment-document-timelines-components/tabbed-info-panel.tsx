/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { DehydratedGQLTimelinePoint } from '../../../../types';
import { ChatLogTab } from './chat-log-tab';
import { AiOutlineTab } from './ai-outline-tab';
import { AiChangeSummaryTab } from './ai-change-summary-tab';

interface TabbedInfoPanelProps {
  timelinePoint: DehydratedGQLTimelinePoint | null;
  studentName: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`info-tabpanel-${index}`}
      aria-labelledby={`info-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 2, pt: 0, height: '100%', overflow: 'auto' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const TabbedInfoPanel: React.FC<TabbedInfoPanelProps> = ({
  timelinePoint,
  studentName,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!timelinePoint) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">
          No timeline point selected
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: '#666',
            '&.Mui-selected': {
              color: '#1976d2',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1976d2',
          },
        }}
      >
        <Tab label="Chat Log" />
        <Tab label="AI Outline" />
        <Tab label="AI Change Summary" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'hidden', height: '100%' }}>
        <TabPanel value={tabValue} index={0}>
          <ChatLogTab
            chatLog={timelinePoint.version?.chatLog || []}
            studentName={studentName}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AiOutlineTab reverseOutline={timelinePoint.reverseOutline} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AiChangeSummaryTab changeSummary={timelinePoint.changeSummary} />
        </TabPanel>
      </Box>
    </Paper>
  );
};
