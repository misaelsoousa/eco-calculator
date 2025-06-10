import { Component } from '@angular/core';
import { SvgComponent } from "../../../_components/icons/svg";
import { MainButtonComponent } from "../../../_components/main-button/main-button.component";

@Component({
  selector: 'app-home',
  imports: [SvgComponent, MainButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
