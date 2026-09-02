/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { Typography } from "@mui/material";

const CssCard = (props: {
  icon?: React.ReactNode;
  title?: string;
  headerButton?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  alt?: boolean;
}): React.ReactNode => {
  return (
    <div
      className="box column spacing"
      style={{
        marginBottom: 20,
        color: "white",
        borderColor: props.alt ? "#5c8a69" : "",
        backgroundImage: props.alt
          ? "linear-gradient(110deg, rgba(121, 160, 117, 0.3) 60%, rgba(100, 87, 71, 0.3) 100%)"
          : "linear-gradient(145deg, rgb(48, 53, 58) 30%, rgb(61, 67, 74) 80%, rgb(48, 53, 58) 100%)",
        boxShadow: "-5px 5px 10px 0px rgba(0, 0, 0, 0.2)",
        ...props.style,
      }}
    >
      <div className="row spacing center-div">
        <div style={{ color: props.alt ? "" : "#5c8a69" }}>{props.icon}</div>
        <Typography style={{ fontWeight: "bold", fontSize: 14, flexGrow: 1 }}>
          {props.title?.toUpperCase()}
        </Typography>
        {props.headerButton}
      </div>
      {props.children}
    </div>
  );
};

export default CssCard;
