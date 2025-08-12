/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  FiberManualRecord,
} from '@mui/icons-material';

export interface TreeItem {
  id: string;
  icon: string;
  title: string;
  onClick: () => void;
  subItems?: TreeItem[];
}

export interface TreeSection {
  id: string;
  title: string;
  items: TreeItem[];
}

interface CollapsibleTreeProps {
  sections: TreeSection[];
  selectedId?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface TreeItemProps {
  item: TreeItem;
  level: number;
  selectedId?: string;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
}

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Box
      sx={{
        py: 1.5,
        px: 1,
        borderBottom: 1,
        borderColor: 'divider',
        mb: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const TreeItemComponent: React.FC<TreeItemProps> = ({
  item,
  level,
  selectedId,
  expandedItems,
  onToggleExpand,
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isSelected = selectedId === item.id;
  const indentWidth = level * 28;

  const getFontSize = (level: number) => {
    switch (level) {
      case 0:
        return '14px';
      case 1:
        return '13px';
      case 2:
        return '12px';
      default:
        return '12px';
    }
  };

  const getIconSize = (level: number) => {
    switch (level) {
      case 0:
        return '16px';
      case 1:
        return '14px';
      case 2:
        return '12px';
      default:
        return '12px';
    }
  };

  const getTextColor = (level: number) => {
    switch (level) {
      case 0:
        return '#1B6A9C';
      case 1:
        return '#495057';
      case 2:
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getFontWeight = (level: number) => {
    return level === 0 ? '500' : 'normal';
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: level === 0 ? 1 : level === 1 ? 0.75 : 0.5,
          cursor: 'pointer',
          ml: `${indentWidth}px`,
        }}
      >
        {/* Expand/Collapse Button */}
        <IconButton
          onClick={() => hasSubItems && onToggleExpand(item.id)}
          size="small"
          sx={{
            width: '20px',
            height: '20px',
            mr: 1,
            color: 'text.secondary',
            cursor: hasSubItems ? 'pointer' : 'default',
            '&:hover': {
              backgroundColor: hasSubItems ? 'action.hover' : 'transparent',
            },
          }}
        >
          {hasSubItems ? (
            isExpanded ? (
              <ExpandMore sx={{ fontSize: '12px' }} />
            ) : (
              <ChevronRight sx={{ fontSize: '12px' }} />
            )
          ) : (
            <FiberManualRecord sx={{ fontSize: '8px' }} />
          )}
        </IconButton>

        {/* Item Content */}
        <Box
          onClick={item.onClick}
          data-cy={`tree-item-${item.id}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: isSelected ? '#e3f2fd' : 'grey.50',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: getIconSize(level),
              mr: 1,
            }}
          >
            {item.icon}
          </Typography>
          <Typography
            sx={{
              fontSize: getFontSize(level),
              fontWeight: getFontWeight(level),
              color: getTextColor(level),
            }}
          >
            {item.title}
          </Typography>
        </Box>
      </Box>

      {/* Sub Items */}
      {hasSubItems && isExpanded && (
        <Box>
          {item.subItems!.map((subItem) => (
            <TreeItemComponent
              key={subItem.id}
              item={subItem}
              level={level + 1}
              selectedId={selectedId}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const CollapsibleTree: React.FC<CollapsibleTreeProps> = ({
  sections,
  selectedId,
  className,
  style,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <Box className={className} sx={style}>
      {sections.map((section, sectionIndex) => (
        <Box key={section.id}>
          <SectionHeader title={section.title} />
          {section.items.map((item) => (
            <TreeItemComponent
              key={item.id}
              item={item}
              level={0}
              selectedId={selectedId}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
            />
          ))}
          {sectionIndex < sections.length - 1 && <Box sx={{ mb: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default CollapsibleTree;
