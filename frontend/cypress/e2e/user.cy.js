describe("User and Guardian Test Cases", () => {
  const login = () => {
    cy.session("userSession", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/user/login",
        body: { email: "lethanhdat@gmail.com", password: "123123" },
      }).then(({ body }) => {
        expect(body).to.have.property("data");
        expect(body).to.have.property("token");

        cy.window().then((window) => {
          window.sessionStorage.setItem("token", JSON.stringify(body.token));
          window.sessionStorage.setItem("jwt", JSON.stringify(body.data));
        });

        cy.log("User logged in successfully with token:", body.token);
      });
    });
  };

  beforeEach(() => {
    login();
    cy.wait(1000);
    cy.visit("http://localhost:3000/home");
  });

  it("TC24 - Display posts on user profile page", () => {
    cy.visit("http://localhost:3000/home");
    cy.get('button[id="user-profile"]').click();
    cy.get("button").contains("My Profile").click();
    cy.wait(1500);
    cy.get('div[id="Posts"]').click();
    cy.wait(2500);
    cy.get('div[id="postSection"]').should("be.visible");
    cy.wait(500);
  });

  it("TC25 - Update user profile information", () => {
    cy.visit("http://localhost:3000/home");
    cy.get('button[id="user-profile"]').click();
    cy.get("button").contains("My Profile").click();
    cy.wait(1500);
    cy.get('div[id="Information"]').click();
    cy.get('input[name="bio"]')
      .clear()
      .type(
        "Passionate about building communities and sharing knowledge, I bring creativity and organization to every project at Wotyfc. Let's connect and inspire together! #WotyfcAdmin #FounderOfWortyF-C",
        { force: true }
      );
    cy.get('input[name="username"]').clear().type("Worty", { force: true });
    cy.get('button[name="gender"]').click();
    cy.get("li").contains("Male").click();
    cy.get('input[name="from"]').clear().type("New Location", { force: true });
    cy.get('input[name="phone"]').clear().type("+123 456 789", { force: true });
    cy.get("button").contains("Update").click();
    cy.wait(1000);
    cy.get('div[id="notistack-snackbar"]').should("be.visible");
  });

  TC27: Chat in product detail page NOT EDITED
  it("TC - Chat on product detail page", () => {
    cy.visit("http://localhost:3000/product/1");
    cy.get("button").contains("Chat").click();
    cy.get(".chat-input").type("Hi, I am interested in this product.");
    cy.get("button").contains("Send").click();

    cy.get(".chat-box").should(
      "contain",
      "Hi, I am interested in this product."
    );
  });

  // TC28: Edit user post
  it("TC37 - Edit a user post", () => {
    cy.get('button[id="user-profile"]').click();
    cy.get("button").contains("My Profile").click();
    cy.wait(1500);
    cy.get('div[id="Posts"]').click();
    cy.wait(2500);
    cy.get('div[id="postSection"]').first().click();
    cy.wait(2500);
    cy.get('button[id="edit"]').click();
    cy.get("button").contains("Edit").click();
    cy.wait(1500);
    cy.get('input[id="edit-post-name"]')
      .clear()
      .type("Macbook pro 2017 Edited", { force: true });
    cy.get('textarea[id="edit-post-content"]')
      .clear()
      .type("This is edited content", { force: true });
    cy.get('button[id="save-edit"').click();
    cy.wait(4000);

    cy.get("h2").should("contain", "Macbook pro 2017 Edited");
    cy.get("span").should("contain", "This is edited content");
    cy.wait(1000);
  });

  it("TC29 - Delete a user post", () => {
    cy.visit("http://localhost:3000/profile");
    cy.get(".post").first().find(".menu-icon").click();
    cy.get(".menu-item").contains("Delete").click();
    cy.get(".confirm-delete").click();

    cy.get(".post").should("not.contain", "deleted content"); 
  });

  it("TC30 - User logs out", () => {
    cy.get('button[id="user-profile"]').click();
    cy.get("span").contains("Sign Out").click();

    cy.url().should("include", "/sign-in");
    cy.wait(2000);
  });

});
