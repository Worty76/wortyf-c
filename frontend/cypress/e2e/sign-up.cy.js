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

  it("Sign up with empty information and show red border input", () => {
    cy.get("button").contains("sign").click();
    cy.get("p").get('[class*="text-red-400"]').should("contain", "required");
    cy.wait(1000);
  });
});
