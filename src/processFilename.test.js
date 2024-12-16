const fs = require('fs');
const path = require('path');
const { processFilename } = require('./source-processor');

describe('processFilename', () => {
  it('throws an error when no filename is provided', () => {
    expect(() => processFilename()).toThrow(Error);
  });

  it('throws a TypeError when the filename is not a string', () => {
    expect(() => processFilename(123)).toThrow(TypeError);
  });

  it('returns null when the file does not exist', () => {
    const filename = 'non-existent-file.txt';
    expect(processFilename(filename)).toBeNull();
  });

  it('returns null when the file is empty', () => {
    const filename = 'empty-file.txt';
    fs.writeFileSync(filename, '');
    expect(processFilename(filename)).toBeNull();
    fs.unlinkSync(filename);
  });

  it('processes the markdown content correctly when the file exists and is not empty', () => {
    const filename = 'test-file.txt';
    const fileContent = 'This is a test file.';
    fs.writeFileSync(filename, fileContent);
    const result = processFilename(filename);
    expect(result).toContain(fileContent);
    fs.unlinkSync(filename);
  });

//   it('throws an error when an error occurs while reading the file', () => {
//     const filename = 'test-file.txt';
//     fs.chmodSync(filename, 0o000); // make the file unreadable
//     expect(() => processFilename(filename)).toThrow(Error);
//     fs.chmodSync(filename, 0o644); // restore the file permissions
//   });
});