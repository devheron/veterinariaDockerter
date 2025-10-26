import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Tutor } from '../../../../models/tutor';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorService } from '../../../../services/tutor';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutor-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './tutor-form.component.html',
  styleUrl: './tutor-form.component.scss'
})
export class TutorFormComponent {
  @Input() tutor: Tutor = new Tutor();
  @Output() meuEvento = new EventEmitter<any>();

  rotaAtiva = inject(ActivatedRoute);
  roteador = inject(Router);
  tutorService = inject(TutorService);

  constructor() {
    let id = this.rotaAtiva.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.tutorService.findById(id).subscribe({
      next: (tutor) => {
        this.tutor = tutor;
      },
      error: (erro) => {
  notifyError(erro);
      }
    });
  }

  save() {
    if (this.tutor.id! > 0) {
      this.tutorService.update(this.tutor, this.tutor.id!).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/tutores']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    } else {
      this.tutorService.save(this.tutor).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/tutores']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    }
  }
}