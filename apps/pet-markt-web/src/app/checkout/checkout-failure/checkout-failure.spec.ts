import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutFailure } from './checkout-failure';

describe('CheckoutFailure', () => {
    let component: CheckoutFailure;
    let fixture: ComponentFixture<CheckoutFailure>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckoutFailure],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckoutFailure);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
