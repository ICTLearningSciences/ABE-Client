/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Assignment } from '../../../store/slices/education-management/types';
import { TwoOptionDialog } from '../../../components/dialog';

interface AssignmentListItemProps {
  assignment: Assignment;
  onEdit: () => void;
  onRemove: () => void;
  isRemoving?: boolean;
}

export default function AssignmentListItem({ 
  assignment, 
  onEdit, 
  onRemove, 
  isRemoving = false 
}: AssignmentListItemProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  return (
    <>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          margin: '8px 0',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#1B6A9C' }}>{assignment.title}</h4>
          {assignment.description && (
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              {assignment.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onEdit}
            style={{
              backgroundColor: '#1B6A9C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setShowRemoveConfirm(true)}
            disabled={isRemoving}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: isRemoving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isRemoving ? 0.6 : 1,
            }}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
      
      <TwoOptionDialog
        title={`Remove assignment "${assignment.title}" from this section?`}
        open={showRemoveConfirm}
        actionInProgress={isRemoving}
        option1={{
          display: 'Cancel',
          onClick: () => setShowRemoveConfirm(false),
        }}
        option2={{
          display: 'Remove',
          onClick: () => {
            onRemove();
            setShowRemoveConfirm(false);
          },
        }}
      />
    </>
  );
}