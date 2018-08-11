import { BranchSelectionModule } from './branch-selection.module';

describe('BranchSelectionModule', () => {
  let branch-selectionModule: BranchSelectionModule;

  beforeEach(() => {
    branch-selectionModule = new BranchSelectionModule();
  });

  it('should create an instance', () => {
    expect(branch-selectionModule).toBeTruthy();
  });
});
