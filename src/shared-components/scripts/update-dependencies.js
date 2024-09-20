/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
const fs = require('fs');
const path = require('path');

// Paths to the package.json files
const rootPackagePath = path.resolve(__dirname, '../../../package.json');
const localPackagePath = path.resolve(__dirname, '../package.json');

// Read the root package.json
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf-8'));
const localPackage = JSON.parse(fs.readFileSync(localPackagePath, 'utf-8'));

// Merge dependencies and devDependencies
localPackage.dependencies = {
  ...(localPackage.dependencies || {}),
  ...(rootPackage.dependencies || {}),
};
localPackage.devDependencies = {
  ...(localPackage.devDependencies || {}),
  ...(rootPackage.devDependencies || {}),
};

// Write the updated package.json back to the current directory
fs.writeFileSync(
  localPackagePath,
  JSON.stringify(localPackage, null, 2),
  'utf-8'
);

console.log('Dependencies updated successfully!');
