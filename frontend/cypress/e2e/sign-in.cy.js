describe("Sign in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
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

    cy.get("p").should("contain", "incorrect");
    cy.wait(1000);
  });

  it("Sign in and click any tags in Home", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat@gmail.com", { force: true });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get("p").contains("Electronics").click();
    cy.wait(2000);
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

  it("Like post", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat@gmail.com", { force: true });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get("p").contains("LMHT").click();
    cy.wait(1000);

    cy.find('button[id="like"]').should("exist").click();

    cy.wait(2000);
  });

  it("comment on the Canon post", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("lethanhdat@gmail.com", { force: true });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });

    cy.get('button[id="find"]').click();
    cy.wait(2000);

    cy.get("p").contains("15-45").click();
    cy.wait(2000);

    cy.get('textarea[id="comment"]').type("Random comment", { force: true });
    cy.get('button[id="post-comment"]').click();

    cy.wait(500);
  });

  it("Chat with the Canon's owner", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("sergioramos@gmail.com", {
      force: true,
    });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });

    cy.get('button[id="find"]').click();
    cy.wait(2000);

    cy.get("p").contains("15-45").click();
    cy.wait(2000);

    cy.get('button[id="chat"]').click();

    cy.wait(500);
  });

  it("Chat with the Canon's owner", () => {
    cy.get("button").contains("Sign").click();

    cy.get('input[name="email"]').type("sergioramos@gmail.com", {
      force: true,
    });
    cy.get('input[type="password"]').type("123123", { force: true });

    cy.get("button").contains("sign").click();

    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });

    cy.get('button[id="find"]').click();
    cy.wait(2000);

    cy.get("p").contains("15-45").click();
    cy.wait(2000);

    cy.get('button[id="chat"]').click();

    cy.wait(500);
  });
});
