const fs = require('fs');
const path = require('path');
const { processAndSaveFileWithTags } = require('./source-processor');

describe('processAndSaveFileWithTags', () => {
  it('throws Error when sourceFilename is not provided', () => {
    expect(() => processAndSaveFileWithTags()).toThrow(Error);
  });

  it('throws TypeError when sourceFilename is not a string', () => {
    expect(() => processAndSaveFileWithTags(123)).toThrow(TypeError);
  });

  it('throws Error when targetFilename is not provided', () => {
    expect(() => processAndSaveFileWithTags('source.txt')).toThrow(Error);
  });

  it('throws TypeError when targetFilename is not a string', () => {
    expect(() => processAndSaveFileWithTags('source.txt', 123)).toThrow(TypeError);
  });

//   it('throws Error when file path is invalid', () => {
//     expect(() => processAndSaveFileWithTags('source.txt', '../invalid/path.txt')).toThrow(Error);
//   });

//   it('processes and saves file correctly', () => {
//     const sourceFilename = 'source.txt';
//     const targetFilename = 'target.txt';
//     const sourceContent = 'Hello World!';
//     fs.writeFileSync(sourceFilename, sourceContent, 'utf8');
//     processAndSaveFileWithTags(sourceFilename, targetFilename);
//     const targetContent = fs.readFileSync(targetFilename, 'utf8');
//     expect(targetContent).toContain(sourceContent);
//     fs.unlinkSync(sourceFilename);
//     fs.unlinkSync(targetFilename);
//   });

//   it('handles error while reading or writing file', () => {
//     const sourceFilename = 'source.txt';
//     const targetFilename = 'target.txt';
//     const sourceContent = 'Hello World!';
//     fs.writeFileSync(sourceFilename, sourceContent, 'utf8');
//     fs.chmodSync(sourceFilename, 0o000); // make the file unreadable
//     expect(() => processAndSaveFileWithTags(sourceFilename, targetFilename)).toThrow(Error);
//     fs.chmodSync(sourceFilename, 0o644); // restore the file permissions
//     fs.unlinkSync(sourceFilename);
//   });
});