import { Component } from '@angular/core';
import { SvgComponent } from "../../_components/icons/svg";
import { MainButtonComponent } from "../../_components/main-button/main-button.component";

@Component({
  selector: 'app-result',
  imports: [SvgComponent, MainButtonComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {

}
