/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from 'react';

export interface TreeItem {
  id: string;
  icon: string;
  title: string;
  onClick: () => void;
  subItems?: TreeItem[];
}

interface CollapsibleTreeProps {
  items: TreeItem[];
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
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: level === 0 ? '8px 0' : level === 1 ? '6px 0' : '4px 0',
          cursor: 'pointer',
          marginLeft: `${indentWidth}px`,
        }}
      >
        {/* Expand/Collapse Button */}
        <div
          onClick={() => hasSubItems && onToggleExpand(item.id)}
          style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            fontSize: '12px',
            color: '#6c757d',
            cursor: hasSubItems ? 'pointer' : 'default',
          }}
        >
          {hasSubItems ? (isExpanded ? '▼' : '▶') : '•'}
        </div>

        {/* Item Content */}
        <div
          onClick={item.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span
            style={{
              fontSize: getIconSize(level),
              marginRight: '8px',
            }}
          >
            {item.icon}
          </span>
          <span
            style={{
              fontSize: getFontSize(level),
              fontWeight: getFontWeight(level),
              color: getTextColor(level),
            }}
          >
            {item.title}
          </span>
        </div>
      </div>

      {/* Sub Items */}
      {hasSubItems && isExpanded && (
        <div>
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
        </div>
      )}
    </div>
  );
};

const CollapsibleTree: React.FC<CollapsibleTreeProps> = ({
  items,
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
    <div className={className} style={style}>
      {items.map((item) => (
        <TreeItemComponent
          key={item.id}
          item={item}
          level={0}
          selectedId={selectedId}
          expandedItems={expandedItems}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
};

export default CollapsibleTree;
