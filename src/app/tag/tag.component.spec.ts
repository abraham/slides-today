import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tag', {
      id: 'angular',
      primaryColor: '#fff',
      complementaryColor: '#000',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('applies the tag colors as CSS custom properties', () => {
    const chip: HTMLElement =
      fixture.nativeElement.querySelector('mat-chip-option');
    expect(
      chip.style.getPropertyValue('--mat-chip-elevated-container-color'),
    ).toEqual('#fff');
    expect(chip.style.getPropertyValue('--mat-chip-label-text-color')).toEqual(
      '#000',
    );
  });
});
