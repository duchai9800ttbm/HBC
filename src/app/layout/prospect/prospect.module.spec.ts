import { ProspectModule } from './prospect.module';

describe('ProspectModule', () => {
  let prospectModule: ProspectModule;

  beforeEach(() => {
    prospectModule = new ProspectModule();
  });

  it('should create an instance', () => {
    expect(prospectModule).toBeTruthy();
  });
});
