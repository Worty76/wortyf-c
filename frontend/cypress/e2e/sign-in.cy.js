describe("Sign in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Sign in with valid fields and redirect to Home", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat123444444@gmail.com", {
      force: true,
    });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get("p").should("contain", "Our Product Categories");
    cy.wait(1000);
  });

  it("Sign in with invalid email and show an error", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat123444444@gmail.com", {
      force: true,
    });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get("p").should("contain", "exist");
    cy.wait(1000);
  });

  it("Sign in with invalid password and show an error", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat@gmail.com", { force: true });
    cy.get('input[type="password"]').type("wrongpassword", { force: true });

    cy.get("button").contains("sign").click();

    cy.get("p").should("contain", "incorrect password");
    cy.wait(1000);
  });
});
