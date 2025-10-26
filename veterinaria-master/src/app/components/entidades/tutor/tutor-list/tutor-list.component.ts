import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tutor } from '../../../../models/tutor';
import { TutorService } from '../../../../services/tutor';
import { FormsModule } from '@angular/forms';
import { TutorFormComponent } from '../../../entidades/tutor/tutor-form/tutor-form.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TutorFormComponent, MdbModalModule],
  templateUrl: './tutor-list.component.html',
  styleUrl: './tutor-list.component.scss',
})
export class TutorListComponent {

  lista: Tutor[] = [];
  pesquisa: string = "";
  tutorEdit!: Tutor;

  
  @Input("modoModal") modoModal: boolean = false;
  @Output("meuEvento") meuEvento = new EventEmitter();
  tutorService = inject(TutorService);
  
  @ViewChild("modalTutorForm") modalTutorForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;
  animal: any;

  constructor() {
    this.findAll();
  }

  findAll() {
    this.tutorService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
  error: (erro) => {
    notifyError(erro);
      }
    });
  }

  delete(tutor: Tutor) {
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
  }).then((result: any) => {
      if (result.isConfirmed) {
        this.tutorService.deleteById(tutor.id!).subscribe({
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
    this.tutorService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  new() {
    this.tutorEdit = new Tutor();
    this.modalRef = this.modalService.open(this.modalTutorForm, { modalClass: 'modal-xl' });
  }

  edit(tutor: Tutor) {
    this.tutorEdit = tutor;
    this.modalRef = this.modalService.open(this.modalTutorForm, { modalClass: 'modal-xl' });
  }

  meuEventoTratamento(mensagem: any) {
    this.findAll();
    this.modalRef.close();

  }

  meuEventoTratamentoTutor(tutor: Tutor) { // Tipo explícito
    this.animal.tutor = tutor;
    this.modalRef.close();
  }

  selecionar(tutor: Tutor) {
    // Quando utilizado em modo modal, emitir o tutor selecionado para o componente pai
    this.meuEvento.emit(tutor);
    // Fechar modal caso esteja aberto
    try { this.modalRef.close(); } catch (e) { /* ignore if not open */ }
  }
}