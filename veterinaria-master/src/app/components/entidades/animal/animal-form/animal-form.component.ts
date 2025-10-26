import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Animal } from '../../../../models/animal';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '../../../../services/animal';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Tutor } from '../../../../models/tutor';
import { TutorService } from '../../../../services/tutor';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';
import { Medico } from '../../../../models/medico';
import { MedicoService } from '../../../../services/medico';
import { Vacina } from '../../../../models/vacina';
import { VacinaService } from '../../../../services/vacina';
import { CommonModule, DatePipe } from '@angular/common';
import { TutorListComponent } from '../../tutor/tutor-list/tutor-list.component';
import { MedicosListComponent } from '../../medico/medico-list/medico-list.component';
import { VacinaListComponent } from '../../vacina/vacina-list/vacina-list.component';


@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [MedicosListComponent,VacinaListComponent, TutorListComponent, CommonModule, MdbFormsModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './animal-form.component.html',
  styleUrl: './animal-form.component.scss'
})
export class AnimalFormComponent {
  @Input("animal") animal: Animal = new Animal();
  @Output("meuEvento") meuEvento = new EventEmitter();

  listaTutores!: Tutor[];
  listaMedicos!: Medico[];
  listaVacinas!: Vacina[];

  rotaAtiva = inject(ActivatedRoute);
  roteador = inject(Router);
  animalService = inject(AnimalService);
  tutorService = inject(TutorService);
  medicoService = inject(MedicoService);
  vacinaService = inject(VacinaService);

  @ViewChild("modalTutoresList") modalTutoresList!: TemplateRef<any>;
  @ViewChild("modalMedicosList") modalMedicosList!: TemplateRef<any>;
  @ViewChild("modalVacinasList") modalVacinasList!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    let id = this.rotaAtiva.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
    this.findAllTutores();
    this.findAllMedicos();
    this.findAllVacinas();
  }

  findById(id: number) {
    this.animalService.findById(id).subscribe({
      next: (animal) => {
        this.animal = animal;
      },
      error: (erro) => {
      notifyError(erro);
        }
    });
  }

  save() {
    if (this.animal.id! > 0) {
      this.animalService.update(this.animal, this.animal.id!).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/animais']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
        notifyError(erro);
        }
      });
    } else {
      this.animalService.save(this.animal).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/animais']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    }
  }

  findAllTutores() {
    this.tutorService.findAll().subscribe({
      next: (lista) => {
        this.listaTutores = lista;
      },
        error: (erro) => {
          notifyError(erro);
        }
    });
  }

  findAllMedicos() {
    this.medicoService.findAll().subscribe({
      next: (lista) => {
        this.listaMedicos = lista;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  findAllVacinas() {
    this.vacinaService.findAll().subscribe({
      next: (lista) => {
        this.listaVacinas = lista;
      },
      error: (erro) => {
        notifyError(erro);
      }
    });
  }

  compareId(a: any, b: any) {
    return a && b ? a.id === b.id : a === b;
  }

  buscarTutor() {
    this.modalRef = this.modalService.open(this.modalTutoresList, { modalClass: 'modal-xl' });
  }

  buscarMedicos() {
    this.modalRef = this.modalService.open(this.modalMedicosList, { modalClass: 'modal-xl' });
  }

  buscarVacinas() {
    this.modalRef = this.modalService.open(this.modalVacinasList, { modalClass: 'modal-xl' });
  }

  deletarMedico(medico: Medico) {
    let indice = this.animal.medicos.findIndex(x => x.id == medico.id);
    this.animal.medicos.splice(indice, 1);
  }

  deletarVacina(vacina: Vacina) {
    let indice = this.animal.vacinas.findIndex(x => x.id == vacina.id);
    this.animal.vacinas.splice(indice, 1);
  }

  meuEventoTratamentoTutor(tutor: Tutor) {
    this.animal.tutor = tutor;
    this.modalRef.close();
  }

  meuEventoTratamentoMedico(medico: Medico) {
    if (!this.animal.medicos) this.animal.medicos = [];
    this.animal.medicos.push(medico);
    this.modalRef.close();
  }

  meuEventoTratamentoVacina(vacina: Vacina) {
    if (!this.animal.vacinas) this.animal.vacinas = [];
    this.animal.vacinas.push(vacina);
    this.modalRef.close();
  }
}

