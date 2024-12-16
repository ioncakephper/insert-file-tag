const fs = require('fs');
const path = require('path');
const {processSourceCode} = require('./source-processor');

describe('processSourceCode', () => {
  it('throws TypeError when sourceCode is not a string', () => {
    expect(() => processSourceCode(123)).toThrow(TypeError);
  });

  it('replaces insert/include tags with file content', () => {
    const sourceCode = '<!-- ::insert file="test.txt" --><!-- :/insert -->';
    const basePath = './test';
    const fileContent = 'Hello World!';
    const filename = path.join(basePath, 'test.txt');
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(path.join(basePath, 'test.txt'), fileContent, 'utf8');
    const result = processSourceCode(sourceCode, basePath);
    expect(result).toContain(fileContent);
    fs.unlinkSync(path.join(basePath, 'test.txt'));
  });

//   it('handles missing file paths in tags', () => {
//     const sourceCode = '<!-- ::insert --><!-- :/insert -->';
//     const basePath = './test';
//     fs.mkdirSync(path.join(basePath), { recursive: true });
//     const result = processSourceCode(sourceCode, basePath);
//     expect(result).toContain('<!-- Error: missing file path -->');
//   });

  it('handles errors when reading files', () => {
    const sourceCode = '<!-- ::insert file="non-existent.txt" --><!-- :/insert -->';
    const basePath = './test';
    const result = processSourceCode(sourceCode, basePath);
    expect(result).toContain('<!-- Error processing file: non-existent.txt -->');
  });

  it('resolves file paths relative to the provided base path', () => {
    const sourceCode = '<!-- ::insert file="test.txt" --><!-- :/insert -->';
    const basePath = './test/subdir';
    const fileContent = 'Hello World!';
    fs.writeFileSync(path.join(basePath, 'test.txt'), fileContent);
    const result = processSourceCode(sourceCode, basePath);
    expect(result).toContain(fileContent);
    fs.unlinkSync(path.join(basePath, 'test.txt'));
  });
});