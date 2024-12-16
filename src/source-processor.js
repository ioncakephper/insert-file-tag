const path = require('path');
const fs = require('fs');

/**
 * Dependencies between functions in this file:
 *
 * - `processFilename` depends on `processSourceCode`
 */

/**
 * source-processor.js
 * └─ isValidPath
 * └─ processSourceCode
 *   └─ processFilename
 *      └─ processAndSaveFileWithTags
 *         └─ updateInsertTagsSafely
 */

/**
 * The order of testing the functions in this file is as follows:
 *
 * 1. `isValidPath`
 * 2. `processFilename`
 * 3. `processSourceCode`
 * 4. `processAndSaveFileWithTags`
 * 5. `updateInsertTagsSafely`
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
    /*
     * Validate the filename
     */
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
        // If the file does not exist, return null
        if (error.code !== 'ENOENT') {
            throw error;
        }

        return null;
    }

    if (!fileContent || fileContent.trim() === '') {
        // If the file is empty, return null
        return null;
    }

    // Process the source content by inserting content of other files
    return processSourceCode(fileContent, path.dirname(filename));
}

/**
 * Processes the source file by replacing insert/include tags with the content
 * of the specified files, and then saves the processed content to the target
 * file.
 *
 * @param {string} sourceFilename - The name of the source file to process.
 * @param {string} targetFilename - The name of the target file to save the
 *        processed content to.
 * @throws {Error} If the file name is not provided or is not a string.
 * @throws {TypeError} If the file name is not a string.
 * @throws {Error} If an error occurs while reading or writing the file.
 */
function processAndSaveFileWithTags(sourceFilename, targetFilename) {
    // if (!isValidPath(sourceFilename) || !isValidPath(targetFilename)) {
    //     throw new TypeError('Invalid file path');
    // }
    if (!sourceFilename) {
        throw new Error("Source file name is required");
    }

    if (typeof sourceFilename !== 'string') {
        throw new TypeError("Source file name must be a string");
    }

    if (!targetFilename) {
        throw new Error("Target file name is required");
    }

    if (typeof targetFilename !== 'string') {
        throw new TypeError("Target file name must be a string");
    }

    // Read the source file content and process it
    // const processedSource = processFilename(path.basename(sourceFilename));
    const processedSource = processFilename(sourceFilename);
    if (!processedSource) {
        throw new Error('Filename processing failed.');
    }

    // Save the processed content to the target file
    try {
        fs.mkdirSync(path.dirname(targetFilename), { recursive: true });
        fs.writeFileSync(targetFilename, processedSource, 'utf8');
    } catch (error) {
        console.error(`Error processing file: ${error.message}`);
    }
}

/**
 * Processes the file by replacing insert/include tags with the content of
 * other files, and saves the processed content to the same file. This
 * function is safe to call concurrently because it uses a temporary file to
 * avoid overwriting the original file during processing.
 *
 * @param {string} filename - The name of the file to process.
 * @throws {Error} If the file name is not provided or is not a string.
 * @throws {TypeError} If the file name is not a string.
 * @throws {Error} If an error occurs while reading or writing the file.
 */
function updateInsertTagsSafely(filename) {
    if (!filename) {
        throw new Error("File name is required");
    }

    if (typeof filename !== 'string') {
        throw new TypeError("File name must be a string");
    }

    const tempFilename = filename + '.tmp';

    try {
        // Process the file and save to a temporary file
        processAndSaveFileWithTags(filename, tempFilename);

        // Rename the temporary file to the original filename
        fs.renameSync(tempFilename, filename);
    } catch (error) {
        console.error(`Error processing file with temp: ${error.message}`);
        // Cleanup: remove the temporary file if it exists
        if (fs.existsSync(tempFilename)) {
            fs.unlinkSync(tempFilename);
        }
    }
}

/**
 * Checks if the given file path is valid and not maliciously trying to escape
 * the base directory.
 *
 * @param {string} filePath - The file path to check.
 * @param {string} [baseDir=process.cwd()] - The base directory to check against.
 * @returns {boolean} True if the path is valid, false otherwise.
 */
function isValidPath(filePath, baseDir = process.cwd()) {
    const pathRegex = /^[a-zA-Z0-9_\-\/\\]+$/;
    if (typeof filePath !== 'string' || !pathRegex.test(filePath)) {
        return false
    }

    // Make sure the base directory exists and is a directory
    if (!fs.existsSync(baseDir) || !fs.lstatSync(baseDir).isDirectory()) {
        console.error(`Invalid base directory: ${baseDir}`);
        return false;
    }

    // Sanitize the file path and base directory by removing any .. and . references
    const sanitizedFilePath = path.normalize(filePath).replace(/(\.\.(\/|\\|$))+/, '');
    const sanitizedBaseDir = path.normalize(baseDir).replace(/(\.\.(\/|\\|$))+/, '');

    // Make sure the file path is absolute
    if (!path.isAbsolute(sanitizedFilePath)) {
        return false;
    }

    try {
        // Resolve the file path and check if it's inside the base directory
        const resolvedPath = path.join(sanitizedBaseDir, sanitizedFilePath);
        const realPath = fs.realpathSync(resolvedPath);
        return realPath.startsWith(sanitizedBaseDir);
    } catch (error) {
        console.error(`Error resolving path: ${error.message}`);
        return false;
    }
}

module.exports = {
    processFilename,
    processSourceCode,
    processAndSaveFileWithTags,
    isValidPath,
    updateInsertTagsSafely,
};