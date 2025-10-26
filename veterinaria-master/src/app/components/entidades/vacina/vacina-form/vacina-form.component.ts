import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Vacina } from '../../../../models/vacina';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VacinaService } from '../../../../services/vacina';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Animal } from '../../../../models/animal';
import { AnimalService } from '../../../../services/animal';
import { notifyError, notifySuccess } from '../../../../services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacina-form',
  standalone: true,
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './vacina-form.component.html',
  styleUrl: './vacina-form.component.scss'
})
export class VacinaFormComponent {
  @Input("vacina") vacina: Vacina = new Vacina();
  @Output("meuEvento") meuEvento = new EventEmitter();

  listaAnimais!: Animal[];

  rotaAtiva = inject(ActivatedRoute);
  roteador = inject(Router);
  vacinaService = inject(VacinaService);
  animalService = inject(AnimalService);

  @ViewChild("modalAnimaisList") modalAnimaisList!: TemplateRef<any>;
  modalService = inject(MdbModalService);
  modalRef!: MdbModalRef<any>;

  constructor() {
    let id = this.rotaAtiva.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
    this.findAllAnimais();
  }

  findById(id: number) {
    this.vacinaService.findById(id).subscribe({
      next: (vacina) => {
        this.vacina = vacina;
      },
      error: (erro) => {
          notifyError(erro);
        }
    });
  }

  save() {
    if (this.vacina.id! > 0) {
      this.vacinaService.update(this.vacina.id!, this.vacina).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/vacinas']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    } else {
      this.vacinaService.save(this.vacina).subscribe({
        next: (mensagem) => {
          notifySuccess(mensagem);
          this.roteador.navigate(['admin/vacinas']);
          this.meuEvento.emit("OK");
        },
        error: (erro) => {
          notifyError(erro);
        }
      });
    }
  }

  findAllAnimais() {
    this.animalService.findAll().subscribe({
      next: (lista) => {
        this.listaAnimais = lista;
      },
        error: (erro) => {
          notifyError(erro);
        }
    });
  }

  compareId(a: any, b: any) {
    return a && b ? a.id === b.id : a === b;
  }

  buscarAnimal() {
    this.modalRef = this.modalService.open(this.modalAnimaisList, { modalClass: 'modal-xl' });
  }

  meuEventoTratamentoAnimal(animal: Animal) {
    if (!this.vacina.animais) this.vacina.animais = [];
    this.vacina.animais.push(animal);
    this.modalRef.close();
  }

  deletarAnimal(animal: Animal) {
    let indice = this.vacina.animais.findIndex(x => x.id == animal.id);
    this.vacina.animais.splice(indice, 1);
  }
}