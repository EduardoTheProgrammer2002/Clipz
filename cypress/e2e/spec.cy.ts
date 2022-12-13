describe('My First Test', () => {
  it('Sanaty test', () => {
    cy.visit('/');
    cy.contains('#header .text-3xl', 'Clip');
  })
})
