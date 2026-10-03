import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ShareComponent } from './share.component';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('shows the share button initially', () => {
    expect(component.exited()).toBe(false);
    expect(fixture.nativeElement.querySelector('button').style.visibility).toBe(
      'visible',
    );
  });

  describe('startShare with the native share sheet', () => {
    afterEach(() => Reflect.deleteProperty(navigator, 'share'));

    const stubShare = (share: () => Promise<void>) =>
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: vi.fn(share),
      });

    it('shows the button again after sharing', async () => {
      stubShare(() => Promise.resolve());
      const snackBar = vi.spyOn(TestBed.inject(MatSnackBar), 'open');

      component.startShare();
      expect(component.exited()).toBe(true);
      await vi.waitFor(() => expect(component.exited()).toBe(false));

      expect(snackBar).not.toHaveBeenCalled();
    });

    it('reports the error and shows the button again when sharing fails', async () => {
      stubShare(() => Promise.reject(new Error('cancelled')));
      const snackBar = vi.spyOn(TestBed.inject(MatSnackBar), 'open');

      component.startShare();
      await vi.waitFor(() => expect(component.exited()).toBe(false));

      expect(snackBar).toHaveBeenCalledWith(
        'Error sharing',
        undefined,
        expect.anything(),
      );
    });
  });

  it('shows the button again when the menu closes', () => {
    component.exited.set(true);

    component.shareMenuTrigger().menuClosed.emit();

    expect(component.exited()).toBe(false);
  });
});
