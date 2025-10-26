import { Component, inject, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Consulta } from '../../../../models/consulta';
import { ConsultaService } from '../../../../services/consulta';
import { FormsModule } from '@angular/forms';
import { ConsultaFormComponent } from '../consulta-form/consulta-form.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';
import { CommonModule, DatePipe } from '@angular/common';
import { MedicosListComponent } from '../../medico/medico-list/medico-list.component';

@Component({
  selector: 'app-consultas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConsultaFormComponent, MdbModalModule],
  providers: [DatePipe],
  templateUrl: './consulta-list.component.html',
  styleUrl: './consulta-list.component.scss',
})
export class ConsultaListComponent {
  lista: Consulta[] = [];
  pesquisa: string = "";
  consultaEdit!: Consulta;

  @Input("modoModal") modoModal: boolean = false;
  @Output("meuEvento") meuEvento = new EventEmitter();

  consultaService = inject(ConsultaService);
  
  @ViewChild("modalConsultaForm") modalConsultaForm!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.findAll();
  }

  findAll() {
    this.consultaService.findAll().subscribe({
        next: (listaRetornada) => {
        this.lista = listaRetornada;
      },
      error: (erro) => {
  notifyError(erro);
      }
    });
  }

  delete(consulta: Consulta) {
    Swal.fire({
      title: 'Deseja mesmo deletar?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
  }).then((result: any) => {
      if (result.isConfirmed) {
        this.consultaService.deleteById(consulta.id!).subscribe({
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

  findByDescricao() {
    this.consultaService.findByDescricao(this.pesquisa).subscribe({
      next: (lista) => {
        this.lista = lista;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  new() {
    this.consultaEdit = new Consulta();
    this.modalRef = this.modalService.open(this.modalConsultaForm, { modalClass: 'modal-xl' });
  }

  edit(consulta: Consulta) {
    this.consultaEdit = consulta;
    this.modalRef = this.modalService.open(this.modalConsultaForm, { modalClass: 'modal-xl' });
  }

  meuEventoTratamento(mensagem: any) {
    this.findAll();
    this.modalRef.close();
  }

  selecionar(consulta: Consulta) {
    this.meuEvento.emit(consulta);
    try { this.modalRef.close(); } catch (e) { }
  }
}