import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = []

  constructor() { }

  register(id: string) : void{
    this.modals.push({
      id,
      visible: false
    })
  }

  unregister(id: string): void {
    this.modals = this.modals.filter(e => e.id !== id);
  }
  
  isModalOpen(id: string) : boolean {
    return !!this.modals.find(e => e.id === id)?.visible;
  }

  toggleModal(id: string) : void{
    const el = this.modals.find(e => e.id === id);

    if(!el) {
      console.log('modal not found');
      return
    }

    this.modals = this.modals.map(el => {
      if(el.id === id) {
        el.visible = !el.visible;
      }
      return el;
    });
  }


}
