// Public Controllers
const getHome = (req, res) => {
  res.status(200).json({ message: "Welcome to Home Page" });
};

const getAbout = (req, res) => {
  res.status(200).json({ message: "Welcome to About Page" });
};

const getContact = (req, res) => {
  res.status(200).json({ message: "Welcome to Contact Page" });
};

module.exports = {
  getHome,
  getAbout,
  getContact,
};