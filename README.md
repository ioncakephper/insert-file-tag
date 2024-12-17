# insert-file-tag

The `insert-file-tag` package is a Node.js utility that simplifies the process of embedding external file content into your documents. It uses special comment tags as markers, allowing you to dynamically insert code snippets, documentation excerpts, or any other text file directly into your main document.  This is particularly useful for:

- **Documentation Generation:** Easily include code examples, configuration files, or output logs into your documentation.
- **Code Reusability:**  Avoid redundancy by keeping reusable code snippets in separate files and referencing them where needed.
- **Content Assembly:**  Combine multiple text files into a single output document.

The package works by parsing your document, looking for special HTML-style comment tags that indicate the path to the file you want to insert. For example:

```html
<!-- ::insert file="path/to/code.js" -->
 Content of path/to/code.js file will be inserted here.
<!-- ::/insert -->
```

The content of path/to/code.js will be inserted between these tags when the utility is run. This keeps your main document clean and maintainable while allowing you to include dynamic content from other sources. insert-file-tag supports various file types and can be easily integrated into your build process.

## Table of Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Installing](#installing)
- [Usage](#usage)
- [Author](#author)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

## Installing

```bash
$ npm i insert-file-tag
```

Or,

```bash
$ npm i insert-file-tag -g
```

This will install the package globally, making it available from the command line. After installing, you can run the `instags` command.

```bash
$ instags -h
```

Or,

You can skip installing it the package globally, and use the `npx instags` command.

```bash
$ npx insert-file-tag -h
```

## Usage

**Basic Usage:**

```bash
npx instags -h
```

This will display the help message, showing available options like `-V` (version) -o (output folder, and others. It explains how to use the command.

```
npx instags -V
```
This will display the version number of the installed insert-file-tag package.

```bash
$ npx instags README.md
```

This command will process the README.md file. It will search for any <!-- ::insert ... --> tags within README.md. If any are found, the specified file content will be inserted in place of the tag, and the updated content will be written back to README.md. If no insert tags are present, the file will remain unchanged.

## Author

[@ioncakephper](https://github.com/ioncakephper)

## License

This project is licensed under the [MIT License](./LICENSE).
