import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeSelector } from './tree-selector';

describe('TreeSelector', () => {
  let component: TreeSelector;
  let fixture: ComponentFixture<TreeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
