import { Component, OnInit } from '@angular/core';
import { MainButtonComponent } from "../../_components/main-button/main-button.component";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-result',
  imports: [CommonModule, MainButtonComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  loading = false;
  error = '';
  resultado: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const obrigatorios = ['origem', 'destino', 'formato', 'tipo', 'quantidade', 'carregamento'];
      const algumFaltando = obrigatorios.some(key => !(key in params) || params[key] === undefined || params[key] === null || params[key] === '');
      if (algumFaltando) {
        window.setTimeout(() => {
          window.location.href = '/';
        }, 100);
        return;
      }
      const payload = {
        origem: params['origem'],
        destino: params['destino'],
        formato: +params['formato'],
        tipo: +params['tipo'],
        quantidade: +params['quantidade'],
        carregamento: +params['carregamento']
      };
      this.loading = true;
      this.apiService.postRelatorio(payload).subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Erro ao gerar relatório';
          this.loading = false;
        }
      });
    });
  }

  async exportPdf() {
    const sectionRota = document.getElementById('pdf-rota');
    const sectionRelatorio = document.getElementById('pdf-relatorio');

    if (!sectionRota || !sectionRelatorio) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const paddingX = 0;
    const marginTop = 0;

    const canvasRota = await html2canvas(sectionRota, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff'
    });

    const imgDataRota = canvasRota.toDataURL('image/png');
    const imgPropsRota = pdf.getImageProperties(imgDataRota);
    const pdfWidthRota = pageWidth - paddingX * 2;
    const pdfHeightRota = (imgPropsRota.height * pdfWidthRota) / imgPropsRota.width;

    pdf.addImage(imgDataRota, 'PNG', paddingX, marginTop, pdfWidthRota, pdfHeightRota);


    const canvasRelatorio = await html2canvas(sectionRelatorio, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff'
    });

    const imgDataRelatorio = canvasRelatorio.toDataURL('image/png');
    const imgPropsRelatorio = pdf.getImageProperties(imgDataRelatorio);
    const pdfWidthRelatorio = pageWidth - paddingX * 2;
    const pdfHeightRelatorio = (imgPropsRelatorio.height * pdfWidthRelatorio) / imgPropsRelatorio.width;

    pdf.addPage();
    pdf.addImage(imgDataRelatorio, 'PNG', paddingX, marginTop, pdfWidthRelatorio, pdfHeightRelatorio);

    pdf.save('relatorio.pdf');
  }
}
