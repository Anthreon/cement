import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-results',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './empty-results.component.html',
  styleUrl: './empty-results.component.scss',
})
export class EmptyResultsComponent {}
