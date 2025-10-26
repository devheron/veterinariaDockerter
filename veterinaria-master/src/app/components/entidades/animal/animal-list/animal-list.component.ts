import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal } from '../../../../models/animal';
import { AnimalService } from '../../../../services/animal';
import { FormsModule } from '@angular/forms';
import { AnimalFormComponent } from '../animal-form/animal-form.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-animais-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimalFormComponent, MdbModalModule],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss',
})
export class AnimalListComponent {
  lista: Animal[] = [];
  pesquisa: string = "";
  animalEdit!: Animal;

  @Input("modoModal") modoModal: boolean = false;
  @Output("meuEvento") meuEvento = new EventEmitter();
  animalService = inject(AnimalService);
  
  @ViewChild("modalAnimalForm") modalAnimalForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  findAll() {
    this.animalService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  delete(animal: Animal) {
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
  }).then((result: any) => {
      if (result.isConfirmed) {
        this.animalService.deleteById(animal.id!).subscribe({
          next: (mensagem) => {
            notifySuccess(mensagem);
            this.findAll();
          },
          error: (erro) => {
            notifyError(erro);
          }
        });
      }
    });
  }

  findByNome() {
    this.animalService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
  notifyError(erro);
      }
    });
  }

  new() {
    this.animalEdit = new Animal();
    this.modalRef = this.modalService.open(this.modalAnimalForm, { modalClass: 'modal-xl' });
  }

  edit(animal: Animal) {
    this.animalEdit = animal;
    this.modalRef = this.modalService.open(this.modalAnimalForm, { modalClass: 'modal-xl' });
  }

  meuEventoTratamento(mensagem: any) {
    this.findAll();
    this.modalRef.close();
  }

  selecionar(animal: Animal) {
    this.meuEvento.emit(animal);
    try { this.modalRef.close(); } catch (e) { }
  }
}