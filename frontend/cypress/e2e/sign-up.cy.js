var randomEmail = require("random-email");

describe("Sign in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/sign-up");
  });

  it("Sign up with a valid account and redirect to Home", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", {
      force: true,
    });

    cy.get('input[name="email"]').type(randomEmail({ domain: "example.com" }), {
      force: true,
    });

    cy.get('input[name="age"]').type(25, {
      force: true,
    });

    cy.get('button[name="gender"]').click();
    cy.wait(500);
    cy.get("li").contains("Male").click();

    cy.get('input[name="from"]').type("Hanoi", {
      force: true,
    });

    cy.get('input[name="password"]').type("ValidPassword1", {
      force: true,
    });

    cy.get('input[name="repassword"]').type("ValidPassword1", {
      force: true,
    });

    cy.get("button").contains("sign").click();

    cy.wait(3000);
  });

  it("Sign up with empty information and display a notification saying fulfilling all fields", () => {
    cy.get("button").contains("sign").click();
    cy.get('button[name="notification"]').should(
      "contain",
      "fulfilling all fields"
    );
    cy.wait(1000);
  });

  it("Sign up with invalid email format and display a notification", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", { force: true });
    cy.get('input[name="email"]').type("invalid-email", { force: true });
    cy.get('input[name="age"]').type(25, { force: true });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').type("Hanoi", { force: true });
    cy.get('input[name="password"]').type("ValidPassword1", { force: true });
    cy.get('input[name="repassword"]').type("ValidPassword1", { force: true });
    cy.get("button").contains("sign").click();

    cy.wait(500);
    cy.get("p").should("contain", "Email is not valid.");
    cy.wait(1000);
  });

  it("Sign up with mismatched passwords and display a notification", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", { force: true });
    cy.get('input[name="email"]').type(randomEmail({ domain: "example.com" }), {
      force: true,
    });
    cy.get('input[name="age"]').type(25, { force: true });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').type("Hanoi", { force: true });
    cy.get('input[name="password"]').type("ValidPassword1", { force: true });
    cy.get('input[name="repassword"]').type("InvalidPassword2", {
      force: true,
    });
    cy.get("button").contains("sign").click();

    cy.get("p").should("contain", "Passwords are not matched");
  });

  it("Sign up with a weak password and display a notification", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", { force: true });
    cy.get('input[name="email"]').type(randomEmail({ domain: "example.com" }), {
      force: true,
    });
    cy.get('input[name="age"]').type(25, { force: true });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').type("Hanoi", { force: true });
    cy.get('input[name="password"]').type("weak", { force: true });
    cy.get('input[name="repassword"]').type("weak", { force: true });
    cy.get("button").contains("sign").click();

    cy.get('button[name="notification"]').should(
      "contain",
      "Password is too weak"
    );
  });

  it("Sign up with age below minimum limit and display a notification", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", { force: true });
    cy.get('input[name="email"]').type(randomEmail({ domain: "example.com" }), {
      force: true,
    });
    cy.get('input[name="age"]').type(-2, { force: true });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').type("Hanoi", { force: true });
    cy.get('input[name="password"]').type("ValidPassword1", { force: true });
    cy.get('input[name="repassword"]').type("ValidPassword1", { force: true });
    cy.get("button").contains("sign").click();

    cy.get("p").should(
      "contain",
      "Age is required and must be a positive number."
    );
  });

  // Test case: Missing required fields (e.g., age)
  it("Sign up with missing age field and display a notification", () => {
    cy.get('input[name="username"]').type("lethanhdatsv3", { force: true });
    cy.get('input[name="email"]').type(randomEmail({ domain: "example.com" }), {
      force: true,
    });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').type("Hanoi", { force: true });
    cy.get('input[name="password"]').type("ValidPassword1", { force: true });
    cy.get('input[name="repassword"]').type("ValidPassword1", { force: true });
    cy.get("button").contains("sign").click();

    cy.get('button[name="notification"]').should("contain", "Age is required");
  });
});
