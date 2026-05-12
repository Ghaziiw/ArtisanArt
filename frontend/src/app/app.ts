import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MyStore } from './features/artisan-dashboard/my-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyStore],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = 'ArtisanArt';
}