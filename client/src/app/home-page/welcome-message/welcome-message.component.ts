import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/shared-module/auth/auth.service';

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss'],
})
export class WelcomeMessageComponent implements OnChanges {
  @Input() isLoggedIn = false;
  userName?: string;

  constructor(private readonly authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'] && this.isLoggedIn) {
      this.userName = this.authService.getUserName();
    }
  }
}
