import PencilIcon from '@mui/icons-material/Edit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DefaultIcon from '@mui/icons-material/Interests';
import PencilOutline from '@mui/icons-material/DriveFileRenameOutline';
export enum DisplayIcons {
  LIGHT_BULB = 'LIGHT_BULB',
  PENCIL = 'PENCIL',
  PENCIL_OUTLINE = 'PENCIL_OUTLINE',
  DEFAULT = 'DEFAULT',
}

export const DisplayIcon = (props: {
  iconName: DisplayIcons;
  style?: React.CSSProperties;
}): JSX.Element => {
  switch (props.iconName) {
    case DisplayIcons.LIGHT_BULB:
      return <LightbulbIcon style={props.style} />;
    case DisplayIcons.PENCIL:
      return <PencilIcon style={props.style} />;
    case DisplayIcons.PENCIL_OUTLINE:
      return <PencilOutline style={props.style} />;
    case DisplayIcons.DEFAULT:
      return <DefaultIcon style={props.style} />;
    default:
      return <> </>;
  }
};
