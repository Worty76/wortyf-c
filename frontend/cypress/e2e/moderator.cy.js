describe("Moderator", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("find some posts with search text is Canon", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat@gmail.com", { force: true });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });

    cy.get('button[id="find"]').click();
    cy.wait(3000);
  });
});
