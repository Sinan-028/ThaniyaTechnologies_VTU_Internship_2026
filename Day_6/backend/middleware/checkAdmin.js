const checkAdmin = (req, res, next) => {

  if (req.query.admin === "true") {
    next()
  } else {
    res.send("Access denied")
  }

}

module.exports = checkAdmin