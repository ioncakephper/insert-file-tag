# insert-file-tag

The `insert-file-tag` package is a Node.js utility that simplifies the process of embedding external file content into your documents. It uses special comment tags as markers, allowing you to dynamically insert code snippets, documentation excerpts, or any other text file directly into your main document.  This is particularly useful for:

- **Documentation Generation:** Easily include code examples, configuration files, or output logs into your documentation.
- **Code Reusability:**  Avoid redundancy by keeping reusable code snippets in separate files and referencing them where needed.
- **Content Assembly:**  Combine multiple text files into a single output document.

The package works by parsing your document, looking for special HTML-style comment tags that indicate the path to the file you want to insert. For example:

```html
<!-- Error processing file: path/to/code.js -->


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

### Installing

```bash
$ npm install insert-file-tag
```

## Usage

**Basic Usage:**

```bash
npx insert-file-tag input.md output.md
```

This will process `input.md`, insert the content specified by the tags, and write the result to `output.md`.

## Author

[@ioncakephper](https://github.com/ioncakephper)

## License

This project is licensed under the [MIT License](./LICENSE).
