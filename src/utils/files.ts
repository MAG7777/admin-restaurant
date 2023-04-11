import * as deepEqual from 'fast-deep-equal/es6/react';

import { pick } from './helpers';

export function verifyFiles(files, prevFiles) {
  const comparablePrevFiles = prevFiles.map(item => item.file).filter(Boolean);
  return filterUniqueFiles(comparablePrevFiles, files).then(filteredFiles => {
    return files.map(file => filteredFiles.some(e => e.id === file.id));
  });
}

export const filterUniqueFiles = (oldFiles, newFiles) => {
  const res = [];

  return newFiles
    .reduce(
      (promise, newFile) =>
        promise
          .then(() => isFileContained([...oldFiles, ...res], newFile))
          .then(isContained => {
            if (!isContained) {
              res.push(newFile);
            }
          }),
      Promise.resolve()
    )
    .then(() => res);
};

function isFileContained(oldFiles, file) {
  return Promise.all(
    oldFiles.map(oldFile => areFilesEqual(oldFile, file))
  ).then(arr => arr.some(item => Boolean(item)));
}

function areFilesEqual(file1, file2) {
  if (
    !deepEqual.default(pickComparedFields(file1), pickComparedFields(file2))
  ) {
    return Promise.resolve(false);
  }

  return areFilesContentsEqual(file1, file2);
}

function pickComparedFields(file) {
  return pick(file, 'size', 'type');
}

function areFilesContentsEqual(file1, file2) {
  return Promise.all([file1, file2].map(getFileContent)).then(
    contents => contents[0] === contents[1]
  );
}

function getFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();

    reader.readAsText(file);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
