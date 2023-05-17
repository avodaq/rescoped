describe('foo', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000);
    // // Custom command example, see `../support/commands.ts` file
    // cy.login('my-email@something.com', 'myPassword');
    //
    // // Function helper example, see `../support/app.po.ts` file
    // getGreeting().contains('Welcome foo');
  });
});
