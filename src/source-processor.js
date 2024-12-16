const path = require('path');
const fs = require('fs');

/**
 * Dependencies between functions in this file:
 *
 * - `processFilename` depends on `processSourceCode`
 */

/**
 * Testing Order:
 *
 * 1. `processSourceCode`
 * 2. `processFilename`
 *
 * This order is important because `processFilename` depends on
 * `processMarkdown` and we want to make sure that all the dependant
 * functions are tested first.
 */




/**
 * Processes the given source code by replacing insert/include tags with the content
 * of the specified files. The file paths are resolved relative to the provided base path.
 *
 * @param {string} sourceCode - The source code containing insert/include tags to be processed.
 * @param {string} [basePath="."] - The base path used to resolve file paths specified in the tags.
 * @returns {string} - The processed source code with file contents inserted.
 * @throws {TypeError} - If the sourceCode is not a string.
 */
function processSourceCode(sourceCode, basePath = ".") {
    if (typeof sourceCode !== 'string') {
        throw new TypeError('sourceCode must be a string');
    }

    /**
     * Matches a single insert/include tag and the content after it until the
     * matching closing tag. The tag name and file path are captured in groups
     * 1 and 2, respectively.
     */
    const insertRegex = /<!--\s*::(insert|include)\s+file\s*=\s*"([^"]+)"(?:[\s\S]*?)\s*-->([\s\S]*?)<!--\s*:\/(insert|include)\s*-->/g;
    const processedContent = sourceCode;

    function getFileContent(filePath, file, existingContent) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const timestamp = new Date().toLocaleString();

            return `<!-- ::insert file="${file}" -->
<!-- Timestamp: ${timestamp} -->
${fileContent}
<!-- :/insert -->`;
        } catch (error) {
            console.error(`Error processing file ${file}:`, error);
            return `<!-- Error processing file: ${file} -->\n${existingContent}`;
        }
    }

    return processedContent.replace(insertRegex, (fullMatch, _, file, existingContent) => {
        if (!file) {
            console.warn('File path is missing in the tag.');
            return `<!-- Error: missing file path -->\n${existingContent}`;
        }

        const filePath = path.join(basePath, file);
        return getFileContent(filePath, file, existingContent);
    });
}


/**
 * Reads the content of a file and processes it by inserting content of other
 * files based on insert/include tags. If the file does not exist or is empty,
 * returns null.
 *
 * @param {string} filename The name of the file to read and process
 * @return {?string} The processed markdown content or null if the file is empty or does not exist
 * @throws {Error} If the file name is not provided or is not a string
 * @throws {TypeError} If the file name is not a string
 * @throws {Error} If an error occurs while reading the file
 */
function processFilename(filename) {
    if (!filename) {
        throw new Error("File name is required");
    }

    if (typeof filename !== 'string') {
        throw new TypeError("File name must be a string");
    }

    let fileContent = null;

    try {
        // Read the content of the file
        fileContent = fs.readFileSync(filename, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }

    if (!fileContent || fileContent.trim() === '') {
        return null;
    }

    // Process the markdown content by inserting content of other files
    return processSourceCode(fileContent, path.dirname(filename));
}

module.exports = {
    processFilename,
    processSourceCode
}