# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 14

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