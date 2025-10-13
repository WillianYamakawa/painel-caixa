import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opcao } from './opcao';

describe('Opcao', () => {
  let component: Opcao;
  let fixture: ComponentFixture<Opcao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opcao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Opcao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
