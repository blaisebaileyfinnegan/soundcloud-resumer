Cypress.on("uncaught:exception", () => {
  return false;
});

describe("soundcloud-remember-position", () => {
  it("should remember the position when a user chooses a track longer than 5 minutes, and load it upon replay", () => {
    cy.visit("/acquarioimmersioni/a-brehme-acquario-11012020");

    cy.get(
      ".playControl.sc-ir.playControls__control.playControls__play.playing"
    );

    // 1:57:30 = 7050 seconds
    cy.get(".playbackTimeline__progressWrapper").click("center");

    cy.wait(5000);

    cy.reload();

    cy.get(".gritter-item");

    cy.get("div.playbackTimeline__progressWrapper").then((elem) => {
      const secondsElapsed = parseInt(elem.attr("aria-valuenow"));
      expect(secondsElapsed).to.be.gte(6960); // tolerance
      expect(secondsElapsed).to.be.lte(7060);
    });
  });
});
