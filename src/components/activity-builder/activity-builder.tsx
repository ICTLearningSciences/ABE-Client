/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { ColumnDiv } from '../../styled-components';
import { ActivityBuilder as ActivityBuilderType } from './types';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { FlowStepsBuilder } from './flow-steps-builder';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function ActivityBuilder(props: {
  activity: ActivityBuilderType;
  updateActivity: (
    activity: ActivityBuilderType
  ) => Promise<ActivityBuilderType>;
}): JSX.Element {
  const { activity, updateActivity } = props;
  const flowsList = activity.flowsList;

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = flowsList.map((flow, index) => {
    return (
      <Tab
        key={flow._id}
        label={`${flow.name || `Flow ${index + 1}`}`}
        {...a11yProps(index)}
      />
    );
  });

  const customTabPanels = flowsList.map((flow, index) => {
    return (
      <CustomTabPanel key={flow._id} value={value} index={index}>
        <FlowStepsBuilder flow={flow} />
      </CustomTabPanel>
    );
  });

  return (
    <ColumnDiv
      style={{
        height: '100%',
        width: '50%',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {tabs}
          </Tabs>
        </Box>
        {customTabPanels}
      </Box>
      {/* Add tabs, keep first tab open */}
    </ColumnDiv>
  );
}
