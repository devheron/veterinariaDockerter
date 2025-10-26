import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Medico } from '../../../../models/medico';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from '../../../../services/medico';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './medico-form.component.html',
  styleUrl: './medico-form.component.scss'
})
export class MedicoFormComponent {
  @Input() medico: Medico = new Medico();
  @Output() meuEvento = new EventEmitter<any>();

  rotaAtiva = inject(ActivatedRoute);
  roteador = inject(Router);
  medicoService = inject(MedicoService);

  constructor() {
    let id = this.rotaAtiva.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.medicoService.findById(id).subscribe({
      next: (medico) => {
        this.medico = medico;
      },
      error: (erro) => {
  notifyError(erro);
      }
    });
  }

  save() {
    if (this.medico.id! > 0) {
      this.medicoService.update(this.medico, this.medico.id!).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/medicos']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    } else {
      this.medicoService.save(this.medico).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/medicos']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    }
  }
}