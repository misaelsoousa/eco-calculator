import { Component, OnInit, effect, signal, InputSignal, input } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'svg-icon',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './svg.html',
})
export class SvgComponent implements OnInit {
  public name: InputSignal<string | null> = input<string | null>(null);
  public color: InputSignal<string | null> = input<string | null>(null);
  public stroke: InputSignal<string | null> = input<string | null>(null);
  public width: InputSignal<string | null> = input<string | null>(null);
  public height: InputSignal<string | null> = input<string | null>(null);

  public svgContent = signal<SafeHtml | null>(null);

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    effect(() => {
      this.getSvg();
    });
  }

  ngOnInit(): void {
    this.getSvg();
  }

  private getSvg() {
    const svgName = this.name();
    if (!svgName) return;

    const svgPath = `/svg/${svgName}.svg`;

    this.http.get(svgPath, { responseType: 'text' }).subscribe({
      next: (data: string) => {
        let svg = this.applySvgColor(data, this.color());
        svg = this.applyStrokeSvgColor(svg, this.stroke());
        svg = this.applySize(svg, this.width(), this.height());
        this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(svg));
      },
      error: (error) => {
        console.error('Erro ao carregar o SVG:', error);
      }
    });
  }

  private applySvgColor(svg: string, color: string | null): string {
    if (!color) return svg;
    return svg.replace(/fill=".*?"/g, `fill="${color}"`);
  }

  private applyStrokeSvgColor(svg: string, stroke: string | null): string {
    if (!stroke) return svg;
    return svg.replace(/stroke=".*?"/g, `stroke="${stroke}"`);
  }

  private applySize(svg: string, width: string | null, height: string | null): string {
    if (!width && !height) return svg;

    return svg.replace(
      /<svg([^>]*)>/,
      `<svg$1 ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''}>`
    );
  }
}
