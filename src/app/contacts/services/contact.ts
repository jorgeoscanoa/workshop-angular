// Injectable marca a esta clase como un servicio // Que puede ser inyectado en otros componentes o servicios
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Definimos la estructura que debe tener un contacto
export interface Contact{
  id: number;
  name: string;
  email: string;
  phone: string;
}
// Decorador queindica que eset servicio se provee a toda la aplicacion(singleton)
@Injectable({
  providedIn: 'root'
})

export class Contact {

  // URL base del API donde se gestionan los contactos
  private API = 'http://localhost:3000/contacts';
  // Inyectamos HttpCliente para poder hacer peticiones HTTP
  constructor( private http: HttpClient) { }

  //Método para obtener la lista completa de contactos
  //Devuelve un observable que emitira un array de Contactos
  getAll(): Observable<Contact[]>{
    return this.http.get<Contact[]>(this.API);
  }

  // Método para crear un nuevo contacto
  // Recibe un contacto sin id (nuestro backend asignara un id)
  // Devuevle un observable que emitirá el contacto creado (Observable nos permite verificar si hemos recibo alguna respuesta)
  create(contact: Omit<Contact, 'id'>): Observable<Contact>{
    return this.http.post<Contact>(this.API, contact);
  }

  // Método para actualizar un contacto existente
  // Recibe un contacto completo con su id y nos devuelve uno actualizado

  update(contact: Contact): Observable<Contact>{
      // Hacemos una peticion PUT a la URL con el id del contacto
      return this.http.put<Contact>(
        `${this.API}/${contact.id}`, // URL con el ID del contacto "http://localhost:3001/contacts/2"
        contact // datos a actualizar
      );
  }

  // Método para eliminar un contacto por su id
  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
