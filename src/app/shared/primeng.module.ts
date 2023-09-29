import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  exports: [
    TableModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule
  ]
})
export class PrimengModule { }
