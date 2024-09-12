const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const cities = [
  "London",
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Leeds",
  "Sheffield",
  "Bristol",
  "Glasgow",
  "Edinburgh",
  "Cardiff",
  "Belfast"
];

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

// API route to check if an email exists in the database
app.get('/api/check-email', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email query parameter is required' });
  }

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email: email });
    
    if (user) {
      return res.status(200).json({ success: true, message: 'Email exists' });
    } else {
      return res.status(404).json({ success: false, message: 'Email does not exist' });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
  
  // GET route to return the list of UK cities
  app.get('/api/cities', (req, res) => {
    res.status(200).json({
      success: true,
      cities: cities
    });
  });


};
