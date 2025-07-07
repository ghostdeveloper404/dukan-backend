const { userRegistration } = require('./validators/user.model.validation');

const testData = {
  name: "test",
  email: "test6@gmail.com",
  password: "3243243232"
};

const { error, value } = userRegistration.validate(testData);

if (error) {
  console.log("Validation failed:", error.details);
} else {
  console.log("Validation passed:", value);
}