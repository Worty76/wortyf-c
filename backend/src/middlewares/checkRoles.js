const checkRole = (roles) => async (req, res, next) => {
  let { name } = req.body;

  const employee = await Employee.findOne({ name });

  !roles.includes(employee.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};
