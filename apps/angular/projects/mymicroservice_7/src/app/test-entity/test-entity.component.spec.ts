import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEntityComponent } from './test-entity.component';

describe('TestEntityComponent', () => {
  let component: TestEntityComponent;
  let fixture: ComponentFixture<TestEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
