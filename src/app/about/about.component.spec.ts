import { TestBed, ComponentFixture } from "@angular/core/testing"
import { AboutComponent } from "./about.component";


describe('AboutComponent', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('Should create', () => {
    expect(component).toBeTruthy();
  })
});