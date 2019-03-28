
import { AppPage } from './app.po';

describe('Web App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display application title: Web', () => {
    page.navigateTo();
    expect(page.getAppTitle()).toEqual('Web');
  });
});
