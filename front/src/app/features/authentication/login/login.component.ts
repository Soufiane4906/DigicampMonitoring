import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MessageModule
  ],
  template: `
    <div class="login-container">
      <p-card header="Connexion" subheader="Bienvenue sur DigicampMonitoring">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Nom d'utilisateur</label>
            <input pInputText id="username" formControlName="username" 
                   placeholder="Entrez votre nom d'utilisateur" class="w-full" />
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <small class="p-error">Le nom d'utilisateur est requis</small>
            }
          </div>

          <div class="field">
            <label for="password">Mot de passe</label>
            <p-password id="password" formControlName="password" 
                        placeholder="Entrez votre mot de passe" 
                        [feedback]="false" 
                        [toggleMask]="true"
                        styleClass="w-full" />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <small class="p-error">Le mot de passe est requis</small>
            }
          </div>

          @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage" styleClass="w-full" />
          }

          <div class="actions">
            <p-button label="Se connecter" 
                      type="submit" 
                      [loading]="loading"
                      [disabled]="loginForm.invalid"
                      styleClass="w-full" />
          </div>

          <div class="register-link">
            <span>Pas encore de compte ? </span>
            <a routerLink="/auth/register">S'inscrire</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    ::ng-deep .p-card {
      width: 100%;
      max-width: 450px;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .actions {
      margin-top: 2rem;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .register-link a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
    }

    .register-link a:hover {
      text-decoration: underline;
    }

    ::ng-deep .p-password {
      width: 100%;
    }

    ::ng-deep .p-password input {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
          console.error('Login error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}