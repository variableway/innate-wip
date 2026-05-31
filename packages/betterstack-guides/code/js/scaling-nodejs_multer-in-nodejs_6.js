# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 6

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