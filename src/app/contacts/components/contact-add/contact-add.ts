import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Contact, ContactService } from '../../services/contact';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-contact-add',
  imports: [
    CommonModule,ReactiveFormsModule,InputTextModule,ButtonModule
  ],
  templateUrl: './contact-add.html',
  styleUrl: './contact-add.css'
})
export class ContactAdd implements OnChanges { // Reacciona a los cambios en @input
  // Recibe el contacto a editar desde el componente padre
  @Input() editContact?: Contact;
  // Eventos que se emiten cuando Crea, actualiza o cancela el formulario
  @Output() created = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  // Definimos el formulario reactivo con sus campos y validaciones

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>('',Validators.required),
    email: new FormControl<string>('',[Validators.required, Validators.email]),
    phone: new FormControl<string>('',Validators.required)
  });

  // Inyectamos el servicio que maneja las llamadas HTTP
  constructor ( private svc : ContactService){}

  // Metodo que se ejecuta automaticamente si cambia el valor del @Input editContact

  ngOnChanges(changes: SimpleChanges): void {
    // Si se detecta un cambio en editContact y tiene datos, se actualiza el formulario
    if (changes['editContact'] && this.editContact) {
      this.form.patchValue({
        id: this.editContact.id, // Carga los datos en el formulario
        name: this.editContact.name,
        email: this.editContact.email,
        phone: this.editContact.phone
      });
    } 
  }

  onSubmit() {
    // Si el formulario no es válido, no hacemos nada
    if (this.form.invalid) return;

    // Obtenemos los valores del formulario
    const id = this.form.get('id')!.value as number | null;
    const name  = this.form.get('name')!.value as string;
    const email = this.form.get('email')!.value as string;
    const phone = this.form.get('phone')!.value as string;

    // Si hay ID, actualizamos un contacto existente
    if (id) {
      this.svc.update({ id, name, email, phone })
        .subscribe(() => this.resetAndEmitUpdated());
    } else {
      // Si no hay ID, es un nuevo contacto
      this.svc.create({ name, email, phone })
        .subscribe(() => this.resetAndEmitCreated());
    }
  }

  // Reseta el formulario y emite evento de creacion

  private resetAndEmitCreated(){
    this.form.reset({id:null, name:'',email:'',phone:''});
    this.created.emit(); // Notifica al componente 
  }

  private resetAndEmitUpdated(){
    this.form.reset({id: null, name: '', email:'',phone:''});
    this.updated.emit(); 
  }

  //Cuando cancela el formulario

  onCancel(){
    this.form.reset({ id: null, name: '', email: '', phone:''});
    this.canceled.emit(); 
  }

}
