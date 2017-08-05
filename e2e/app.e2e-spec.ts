import { TesteappPage } from './app.po';

describe('testeapp App', () => {
  let page: TesteappPage;

  beforeEach(() => {
    page = new TesteappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
