import "cypress-file-upload";

describe("Home", () => {
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

  it("Sign in and click any tags in Home", () => {
    cy.get("p").contains("Electronics").click();
    cy.get("h4").should("contain", "Electronics");
  });

  it("Find some posts with search text is Canon", () => {
    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });
    cy.get('button[id="find"]').click();
    cy.wait(3000);
  });

  it("Like post", () => {
    cy.get("p").contains("Đồng hồ thông minh Haylou watch R8").click();
    cy.get('button[id="like"]').click();

    cy.wait(1000);
    cy.get('button[id="like"]')
      .should("have.attr", "class")
      .and("contain", "#feeceb");
  });

  it("Comment on the Canon post", () => {
    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Đồng hồ", { force: true });
    cy.get('button[id="find"]').click();
    cy.wait(500);
    cy.get("p").contains("Đồng hồ thông minh Haylou watch R8").click();
    cy.wait(1000);
    cy.get('textarea[id="comment"]').type("Random comment", { force: true });
    cy.get('button[id="post-comment"]').click();
    cy.wait(1000);
  });

  it("Chat with the Canon's owner", () => {
    cy.get('button[id="filter"]').click();
    cy.get('input[name="searchName"]').type("Canon", { force: true });
    cy.get('button[id="find"]').click();
    cy.get("p").contains("15-45").click();
    cy.get('button[id="chat"]').click();
  });

  it("TC10 - Check chat screen display on Đồng hồ thông minh Haylou watch R8 product page", () => {
    cy.visit("http://localhost:3000/post/6725ec12eb12adc69bc4d05c");
    cy.wait(1500);
    cy.get('button[id="chat"]').click();
    cy.wait(1000);
    cy.get("p").should("contain", "No messages yet");
    cy.wait(500);
  });

  it("TC11 - Check filter options in Beauty & Personal Care", () => {
    cy.visit("http://localhost:3000/tag/664881926d73b7183cdef336");
    cy.get('button[id="filter"]').click();

    cy.get("label").should("contain", "Not sold").and("contain", "No comments");
    cy.get("label")
      .should("contain", "Newest")
      .and("contain", "Oldest")
      .and("contain", "Most likes");
    cy.get('button[id="find"]').should("be.visible");
  });

  it("TC12 - Search for 'sport' in Electronics tag page", () => {
    cy.visit("http://localhost:3000/tag/666f6c8a75ea8ca77b54a4b9");
    cy.get('button[id="filter"]').click();
    cy.get('input[id="searchTag"]').type("sport", {
      force: true,
    });
    cy.get('button[id="find"]').click();
    cy.wait(1000);
    cy.get("p").should("contain", "Xe đạp địa hình");
  });

  it("TC13 - Create a new post", () => {
    cy.visit("http://localhost:3000/home");
    cy.get("button").contains("Create Post").click();
    cy.get('input[id="name"]').type("Sample Product");
    cy.get('input[id="price"]').type("100");
    cy.get('textarea[id="content"]').type("This is a sample product.");
    cy.get('button[id="selectTopic"]').click();
    cy.wait(500);
    cy.get("li").contains("Fashion").click();
    cy.get('input[type="file"]').attachFile(
      "../../src/assets/images/author-worty.jpg"
    );
    cy.get("button").contains("Post").click();
    cy.wait(6000);
    cy.get("h2").should("contain", "Sample Product");
  });

  it("TC16 - Check Guardians page display", () => {
    cy.visit("http://localhost:3000/home");
    cy.get("p").contains("Pages").click();
    cy.get("button").contains("Guardians").click();

    cy.get("h4").should("contain", "Guardians");
    cy.get("button").should("contain", "Message");
    cy.wait(1000);
  });

  it("TC17 - Check Guardian user details", () => {
    cy.visit("http://localhost:3000/guardians");
    cy.get("h6").contains("Duane Duncan").click();

    cy.wait(1000);
    cy.get("h6").should("contain", "Duane Duncan");
    cy.get('p[id="bio"]').should("be.visible");
    cy.wait(500);
  });

  it("TC18 - Send a message to another user", () => {
    cy.visit("http://localhost:3000/profile/666f6122496381e0b84747d4");
    cy.wait(1500);
    cy.get('button[id="message"]').click();
    cy.wait(1000);
    cy.get('input[type="text"]').type("Hello, how are you?");
    cy.wait(2500);
    cy.get('input[type="text"]').trigger("keydown", {
      key: "Enter",
    });
    cy.wait(2500);

    cy.get("p").should("contain", "Hello, how are you?");
    cy.wait(2000);
  });

  it("TC19 - Send a image to another user", () => {
    cy.visit("http://localhost:3000/profile/666f6122496381e0b84747d4");
    cy.wait(1500);
    cy.get('button[id="message"]').click();
    cy.wait(1000);
    cy.get('input[id="file-input"]').attachFile(
      "../../src/assets/images/author-worty.jpg"
    );
    cy.wait(6000);

    cy.get("img").should("be.visible");
    cy.wait(1000);
  });

  it("TC26 - Search tag 'Electronics' on Home", () => {
    cy.visit("http://localhost:3000/home");
    cy.get("button").contains("Explore Other Categories").click();
    cy.get('input[name="searchTag"]').type("Electronics");
    cy.get("button").contains("Search").click();

    cy.get(".search-results").should("contain", "Electronics");
  });
});
