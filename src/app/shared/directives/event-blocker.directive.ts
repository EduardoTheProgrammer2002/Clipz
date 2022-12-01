import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {
  
  @HostListener('drop', ['$event']) // hostListener decorator listens for an event that occours in the host element the directive is applyed to.
  @HostListener('dragover', ['$event'])
  //This is the method we use to prevent the event default behavior
  public handleEvent($event: Event) {
    $event.preventDefault();
  }

}
