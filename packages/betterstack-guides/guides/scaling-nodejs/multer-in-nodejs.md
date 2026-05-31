# Uploading Files with Multer in Node.js

[Multer](https://github.com/expressjs/multer) is a popular middleware for handling file uploads in [Node.js](https://nodejs.org/) applications, especially those built with [Express](https://expressjs.com/). It makes receiving, validating, and storing files from HTTP requests simple and straightforward.

Multer is built on top of [Busboy](https://github.com/mscdex/busboy) and gives you an easy way to manage file uploads through configuration. You can use it for basic uploads or set up complex validation rules to secure your application.

This guide will show you how to add Multer to your Express apps, set up different storage options, create validation rules, and safely handle common file upload scenarios.

[ad-logs]

## Prerequisites

Before starting, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed. You should also know the basics of building Express applications.

## Setting up the project directory

Let's create a directory for a simple Express application that can handle file uploads with Multer.

First, create a new project folder and initialize it:

```command
mkdir multer-uploads && cd multer-uploads
```

```command
npm init -y
```

To use modern JavaScript features like `import` statements, enable ECMAScript Modules in your project:

```command
npm pkg set type=module
```

This command adds the `type: module` field to your `package.json`, letting you use `import` and `export` syntax in your code.

Next, install Express and create a basic server:

```command
npm install express
```

Create an `index.js` file in your project folder with this code:

```javascript
[label index.js]
import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
    <form>
      <p>Upload functionality not implemented yet.</p>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Start your server by running this command in your terminal:

```command
node index.js
```

You should see the message "Server running on http://localhost:3000" in your terminal.

Open your browser and visit `http://localhost:3000` to see your application. You'll see a simple page with a heading and a message that the upload functionality isn't implemented yet.

![Screenshot of asimple page with a heading and a message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f3173ef0-c671-4b58-d4d6-c265dd7aa600/lg2x =3248x2000)

Now you have a minimal Express app that will be the foundation for adding file uploads.

## Getting started with Multer

Let's add Multer to your Express application so it can handle file uploads. Multer makes it easy to process and store uploaded files with minimal setup.

First, install Multer:

```command
npm install multer
```

Update your `index.js` file to use Multer for basic file handling:

```javascript
[label index.js]
import express from "express";
[highlight]
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
[/highlight]

const app = express();
const PORT = 3000;

[highlight]
// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
[/highlight]
app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
[highlight]
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
      <button type="submit">Upload</button>
    </form>
[/highlight]
  `);
});

[highlight]
app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  console.log(req.file); // Contains file info
  res.send(`File uploaded successfully: ${req.file.filename}`);
});
[/highlight]

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

The highlighted code enables file uploads using Multer in an Express.js app. 

It sets up path utilities to determine the current directory, which is needed to save files correctly. Multer is then configured to store uploaded files in an `uploads/` folder and rename them with a timestamp to avoid duplicates.

The server shows a simple upload form, and when a file is submitted, it’s processed and saved, with a confirmation message returned.

Before testing this code, create an `uploads` folder in your project:

```command
mkdir uploads
```

Now restart your server and upload a file through the form at `http://localhost:3000/`:

![Screenshot of multer](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c16ca074-4995-48d9-6bc5-90f676c52700/public =3248x2000)

You'll see information about the uploaded file in your console, like this:

```text
[output]
{
  fieldname: 'uploadedFile',
  originalname: 'sample.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads/',
  filename: 'sample.png',
  path: 'uploads/sample.png',
  size: 614539
}
```

It worked! Multer processed the file, saved it to the `uploads` folder with a unique name, and gave you the file's details through `req.file`. This information lets you do more with the file after it's uploaded.

## Understanding Multer's core concepts

Multer has several key components that help you handle file uploads. Let's look at the main ones:

Here's the revised section with specificity about memory storage and clarification that we're sticking with disk storage in the tutorial:

### Storage engines

Multer has two built-in ways to store files:

1. **DiskStorage**: Saves files to your server's disk with full control over where and how
2. **MemoryStorage**: Keeps files in memory as Buffer objects

You've already seen DiskStorage, which we'll use throughout this tutorial since it's better for most use cases. Disk storage provides persistence and doesn't consume your application's memory, making it ideal for production environments.

If you wanted to use MemoryStorage instead, here's how you'd implement it:

```javascript
// ...
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ...
app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  // File is available as a buffer in req.file.buffer
  console.log(req.file.buffer);
  res.send(`File uploaded to memory. Size: ${req.file.size} bytes`);
});
// ...
```

Memory storage is useful when you need to process a file before deciding where to store it, or when using cloud storage services. However, it's not recommended for large files as it loads the entire file into RAM, which can cause your application to crash if you receive many uploads simultaneously.

### File filters

Let's modify your application only to accept image files. This will prevent users from uploading other file types that might pose security risks.

Update your `index.js` file by adding these new parts:

```javascript
[label index.js]
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

[highlight]
// Add file filter to only accept images
const fileFilter = function (req, file, cb) {
  // Accept only images
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
[/highlight]

const upload = multer({ 
  storage: storage,
[highlight]
  fileFilter: fileFilter
[/highlight]
});
```

Also update your form to show users what files are accepted:

```javascript
[label index.js]
...
app.get("/", (req, res) => {
  res.send(`
    <h1>Image Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
[]
      <input type="file" name="uploadedFile" />
[highlight
      <p>Note: Only JPG, JPEG, PNG, and GIF files are allowed</p>
[/highlight]
      <button type="submit">Upload</button>
    </form>
  `);
});
```

Finally, add an error handler at the end of your file:

```javascript
[label index.js]

...
[highlight]
// Error handler for file filter rejections
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});
[/highlight]

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

```

Save this file and start your server:

```command
node index.js
```

Now try to upload a non-image file (like a PDF or text file) - you'll see an error message in your browser at `http://localhost:3000/` or in the console:

```text
[output]
Server running on http://localhost:3000
Error: Only image files are allowed!
    at fileFilter (file:///path/to/your/project/index.js:24:15)
    at wrappedFileFilter (/path/to/your/project/node_modules/multer/index.js:44:7)
    at Multipart.<anonymous> (/path/to/your/project/node_modules/multer/lib/make-middleware.js:109:7)
...
    at Multipart._write (/path/to/your/project/node_modules/busboy/lib/types/multipart.js:567:19)
```
This helps ensure only valid file types are accepted, but there’s another important safeguard we should add—upload limits. 

### Upload limits

In addition to checking file types, limiting the size and number of files users can upload is important. This protects your server from performance issues or abuse caused by huge uploads.

Multer allows you to set these restrictions using its `limits` option easily.

Now let's add size limits to prevent large file uploads. Add these parts to your `index.js`:

```javascript
[label index.js]
...
// Update the multer configuration to include limits
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
[highlight]
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
    files: 1 // Maximum number of files
  }
[/highlight]
});
```

Update your form to show the size limit:

```javascript
[label index.js]
...
app.get("/", (req, res) => {
  res.send(`
    <h1>Image Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
[highlight]
      <p>Note: Only JPG, JPEG, PNG, and GIF files under 2MB are allowed</p>
[/highlight]
      <button type="submit">Upload</button>
    </form>
  `);
});
```

Enhance your error handler to show specific messages for size limits:

```javascript
[label index.js]
// Error handler for file filter and limit rejections
app.use((err, req, res, next) => {
[highlight]
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large. Maximum size is 2MB.');
    }
  }
[/highlight]
  res.status(400).send(err.message);
});
..
```

Save this file and restart your server:

```command
node index.js
```

Try uploading a large image file (over 2MB) at `http://localhost:3000/` and you'll see the size limit error message. Upload a small image file and it should work properly.

These practical examples show you how to control what gets uploaded to your server, making your application more secure and efficient.

## Handling multiple files

Many apps need to handle multiple file uploads at once. Multer makes this easy with its `array`, `fields`, and `any` methods. This section shows advanced usage patterns you can implement later as your application grows.

### Uploading multiple files from a single field

To allow multiple files from one form field, use the `array` method:

```javascript
// ...
app.get("/", (req, res) => {
  res.send(`
    <h1>Multiple File Upload Demo</h1>
    <form action="/upload-multiple" method="post" enctype="multipart/form-data">
      <input type="file" name="gallery" multiple />
      <button type="submit">Upload Files</button>
    </form>
  `);
});

app.post("/upload-multiple", upload.array('gallery', 5), (req, res) => {
  console.log(req.files); // Array of file objects
  const fileNames = req.files.map(file => file.filename).join(', ');
  res.send(`Uploaded ${req.files.length} files: ${fileNames}`);
});
// ...
```

The second parameter (`5`) sets the maximum number of files allowed.

### Handling files from different fields

For forms with multiple file input fields, use the `fields` method:

```javascript
app.get("/profile", (req, res) => {
  res.send(`
    <h1>Profile Update</h1>
    <form action="/update-profile" method="post" enctype="multipart/form-data">
      <div>
        <label>Profile Picture</label>
        <input type="file" name="avatar" />
      </div>
      <div>
        <label>Portfolio Samples (up to 3)</label>
        <input type="file" name="portfolio" multiple />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  `);
});

app.post("/update-profile", upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'portfolio', maxCount: 3 }
]), (req, res) => {
  console.log(req.files.avatar); // Array with one file
  console.log(req.files.portfolio); // Array with up to three files
  res.send('Profile updated successfully');
});
// ...
```

These methods help you handle complex upload scenarios while keeping your code clean and readable.

## Error handling in Multer

Good error handling is important when working with file uploads. Users might try to upload files that are too large or have the wrong format. Multer throws specific errors that you can catch and handle properly.

Here's how to set up error handling:

```javascript
// ...
// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large. Maximum size is 5MB.');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).send('Too many files uploaded.');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send('Unexpected field name for file upload.');
    }
    // For any other Multer error
    return res.status(400).send(`Upload error: ${err.message}`);
  }
  
  // For non-Multer errors
  console.error(err);
  res.status(500).send('Something went wrong during file upload.');
});
// ...
```

For more control, you can handle errors in each route:

```javascript
// ...
const handleUpload = (req, res, next) => {
  const uploadMiddleware = upload.single('uploadedFile');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Handle Multer errors
        return res.status(400).send(`Upload error: ${err.message}`);
      }
      // Handle other errors
      return res.status(500).send(`Server error: ${err.message}`);
    }
    
    // No error, continue
    next();
  });
};

app.post("/upload-with-error-handling", handleUpload, (req, res) => {
  res.send(`File uploaded successfully: ${req.file.filename}`);
});
// ...
```

This approach gives users helpful messages when uploads fail, improving their experience.

## Final thoughts

[Multer](https://github.com/expressjs/multer) is a powerful tool for handling file uploads in Node.js apps. It's simple to use but flexible enough for most file upload needs.

For special cases, you might consider alternatives like [Formidable](https://github.com/node-formidable/formidable) or [Busboy](https://github.com/mscdex/busboy) (which Multer uses under the hood). Formidable offers progress tracking and direct cloud storage integration without extra packages.

When implementing file uploads, always focus on security, validate files carefully, and think about your app's performance needs. With the right approach, file uploads can work smoothly for your users while keeping your app secure.

Thanks for reading, and happy coding!