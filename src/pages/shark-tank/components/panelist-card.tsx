/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';
import * as motion from 'motion/react-client';
import { Card, CardMedia, Typography } from '@mui/material';
import { stringToColor } from '../helpers';
import { Panelist } from '../../../store/slices/panels/types';

export default function PanelistCard(props: {
  p: Panelist;
  isActive: boolean;
  onMemberClick: (m: Panelist) => void;
}): JSX.Element {
  const { p, onMemberClick } = props;
  return (
    <motion.div
      key={p.clientId}
      whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
      onClick={() => onMemberClick(p)}
    >
      <Card
        style={{
          height: 160,
          width: 256,
          position: 'relative',
          borderWidth: 5,
          borderStyle: 'solid',
          borderColor: stringToColor(p.panelistName),
          borderRadius: 5,
          opacity: !props.isActive ? 0.25 : 1,
        }}
      >
        <CardMedia component="img" height="160" image={p.profilePicture} />
        <div
          className="row"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 5,
            backgroundImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1))',
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <Typography
              color="secondary"
              style={{ fontSize: 10, fontWeight: 'bold' }}
            >
              {p.panelistDescription?.toUpperCase()}
            </Typography>
            <Typography
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {p.panelistName}
            </Typography>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
