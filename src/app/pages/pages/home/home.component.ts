import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from "../../../_components/icons/svg";
import { MainButtonComponent } from "../../../_components/main-button/main-button.component";
import { AutocompleteComponent, AutocompleteOption } from "../../../_components/autocomplete/autocomplete.component";
import { ApiService, Municipio } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, SvgComponent, MainButtonComponent, AutocompleteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  municipios: Municipio[] = [];
  municipioOrigem: Municipio | null = null;
  municipioDestino: Municipio | null = null;
  loading = false;
  error = '';
  formato: number = 0;
  tipo: number = 0;
  quantidade: number = 0;
  carregamento: number = 0;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.carregarMunicipios();
  }

  carregarMunicipios() {
    this.loading = true;
    this.error = '';

    this.apiService.getMunicipios().subscribe({
      next: (municipios) => {
        this.municipios = municipios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar municípios da API:', error);
        this.error = error.message || 'Erro ao carregar lista de municípios da API';
        this.loading = false;
      }
    });
  }
  criarRelatorio() {
    if (!this.municipioOrigem || !this.municipioDestino) {
      alert('Selecione origem e destino.');
      return;
    }
    const queryParams = {
      origem: this.municipioOrigem.value,
      destino: this.municipioDestino.value,
      formato: this.formato,
      tipo: this.tipo,
      quantidade: this.quantidade,
      carregamento: this.carregamento
    };
    this.router.navigate(['/results'], { queryParams });
  }
}
