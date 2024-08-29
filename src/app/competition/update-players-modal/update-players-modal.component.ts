import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-update-players-modal',
  templateUrl: './update-players-modal.component.html',
  styleUrls: ['./update-players-modal.component.less']
})
export class UpdatePlayersModalComponent {
  password?: string;

  constructor(
    private ref: DynamicDialogRef
  ) {}

  isPasswordCorrect(password: string): boolean {
    return password === 'the password';
  }

  submit() {
    if(this.password) this.ref.close(this.isPasswordCorrect(this.password));
  }
}
