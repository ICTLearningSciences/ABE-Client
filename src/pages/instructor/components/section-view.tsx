/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from 'react';

interface SectionViewProps {
  courseId: string;
  sectionId: string;
}

const SectionView: React.FC<SectionViewProps> = ({ courseId, sectionId }) => {
  return (
    <div style={{
      textAlign: 'center',
      maxWidth: '400px'
    }}>
      <div style={{
        fontSize: '48px',
        color: '#1B6A9C',
        marginBottom: '24px'
      }}>
        📑
      </div>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '24px',
        fontWeight: '600',
        color: '#495057'
      }}>
        Section View
      </h3>
      <p style={{
        margin: '0',
        fontSize: '16px',
        color: '#6c757d',
        lineHeight: '1.5'
      }}>
        Section details will be displayed here. This will be implemented in a later phase.
      </p>
      <p style={{
        margin: '16px 0 0 0',
        fontSize: '12px',
        color: '#adb5bd'
      }}>
        Course ID: {courseId} | Section ID: {sectionId}
      </p>
    </div>
  );
};

export default SectionView;