import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medico } from '../../../../models/medico';
import { MedicoService } from '../../../../services/medico';
import { FormsModule } from '@angular/forms';
import { MedicoFormComponent } from '../medico-form/medico-form.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MedicoFormComponent, MdbModalModule],
  templateUrl: './medico-list.component.html',
  styleUrl: './medico-list.component.scss',
})
export class MedicosListComponent {
  lista: Medico[] = [];
  pesquisa: string = "";
  medicoEdit!: Medico;

  
  @Input("modoModal") modoModal: boolean = false;
  @Output("meuEvento") meuEvento = new EventEmitter();
  medicoService = inject(MedicoService);
  
  @ViewChild("modalMedicoForm") modalMedicoForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.medicoEdit = new Medico();
    this.findAll();
  }

  findAll() {
    this.medicoService.findAll().subscribe({
      next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  delete(medico: Medico) {
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
  }).then((result: any) => {
      if (result.isConfirmed) {
        this.medicoService.deleteById(medico.id!).subscribe({
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
    this.medicoService.findByNome(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  new() {
    this.medicoEdit = new Medico(); // <-- Adicione esta linha para reinicializar
    this.modalRef = this.modalService.open(this.modalMedicoForm, { modalClass: 'modal-xl' });
  }
  
  edit(medico: Medico) {
    this.medicoEdit = Object.assign({}, medico); // <-- Usar cópia para evitar referência direta
    this.modalRef = this.modalService.open(this.modalMedicoForm, { modalClass: 'modal-xl' });
  }

  meuEventoTratamento(mensagem: any) {
    this.findAll();
    this.modalRef.close();
  }

  selecionar(medico: Medico) {
    this.meuEvento.emit(medico);
    try { this.modalRef.close(); } catch (e) { }
  }
}