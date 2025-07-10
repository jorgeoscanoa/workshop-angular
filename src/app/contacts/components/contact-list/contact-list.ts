import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Contact, ContactService } from '../../services/contact';
import { ContactAdd } from '../contact-add/contact-add';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, TableModule, ButtonModule,ContactAdd],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  // Signal almacenar la lista de contactos
  contacts = signal<Contact[]>([]);
  // Signal que indica si estamos editando un contacto (o creando uno nuevo)
  editing = signal<Contact | undefined>(undefined);

  //Constructor : se ejecuta al crear la instancia del componente
  constructor ( private svc : ContactService){}

  ngOnInit(): void {
    this.load(); // Cargamos los contactos del componente
  }
  // Metodo para cargar todos los contactos del servicio
  load() {
    this.svc.getAll().subscribe(list =>{
      console.log('[DEBUG] contacts loaded:', list);
      this.contacts.set(list);
    })
  }
  // Editar
  onEdit(contact: Contact){
    this.editing.set(contact); // Establece el contacto actual con el que se esta editando
  }

  // Metodo que llama al hacer clic en "Nuevo Contacto"
  newContact(){
    // Creamos un nuevo objeto vacio
    this.editing.set({ id: undefined!, name: '', email:'',phone:''});
  }

  //Metodo que se ejecuta despues de crear, actualizar o cancelar formilario
  onSaved(){
    this.editing.set(undefined); // Ocultar el formulario
    this.load()
  }

  //Metodo para eliminar un contacto

  delete(id: number | null){
    if(id == null){
      console.warn('[DEBUG] delete() aborted: id is null or undefined');
      return; // Salimos si el ID no es valido
    }

    // Mostramos un cuado de confirmacion antes de borrar
    if (confirm('¿Borrar contacto?')){
      // Lllamar al servicio para eliminar el contacto
      this.svc.delete(id).subscribe({
        next: () => this.load(), //Si todo va bien, recargamos la lista
        error: err => console.error('[DEBUG] delete() error = ', err)
      });
    }
  }
  
}
