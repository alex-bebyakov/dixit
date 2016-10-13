import {DixitPage} from "./app.po";

describe('dixit App', function () {
  let page: DixitPage;

  beforeEach(() => {
    page = new DixitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
