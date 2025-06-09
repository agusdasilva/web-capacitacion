import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

// Pipes/Directives
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { SoloNumerosDirective } from './directives/solo-numeros.directive';
import { LoadingComponent } from './components/loading/loading.component';
import { CardComponent } from './components/card/card.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    CapitalizarPipe,
    SoloNumerosDirective,
    LoadingComponent,
    CardComponent
  ],
  imports: [ CommonModule,
      RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    CapitalizarPipe,
    SoloNumerosDirective,
    CommonModule,
    LoadingComponent,
    CardComponent
  ]
})
export class SharedModule {}

